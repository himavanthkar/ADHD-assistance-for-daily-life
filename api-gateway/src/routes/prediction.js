const express = require('express');
const router = express.Router();

// Store biometric data temporarily (in production, use Redis/database)
let biometricData = [];
let userPatterns = new Map();

// --- Brain State Prediction Endpoints ---

// Collect biometric data from browser
router.post('/biometrics', (req, res) => {
  const { 
    userId, 
    eyeTracking, 
    voiceStress, 
    keystrokePattern, 
    mouseMovement, 
    timestamp 
  } = req.body;

  const dataPoint = {
    userId,
    timestamp: timestamp || new Date().toISOString(),
    eyeTracking: {
      blinkRate: eyeTracking?.blinkRate || 0,
      pupilDilation: eyeTracking?.pupilDilation || 0,
      gazeStability: eyeTracking?.gazeStability || 0
    },
    voiceStress: {
      pitch: voiceStress?.pitch || 0,
      speed: voiceStress?.speed || 0,
      intensity: voiceStress?.intensity || 0
    },
    keystrokePattern: {
      avgSpeed: keystrokePattern?.avgSpeed || 0,
      rhythm: keystrokePattern?.rhythm || 0,
      pressure: keystrokePattern?.pressure || 0
    },
    mouseMovement: {
      velocity: mouseMovement?.velocity || 0,
      jerkiness: mouseMovement?.jerkiness || 0,
      precision: mouseMovement?.precision || 0
    }
  };

  // Store data point
  biometricData.push(dataPoint);
  
  // Keep only last 100 data points per user
  biometricData = biometricData.slice(-100);

  // Analyze patterns and predict brain state
  const brainState = analyzeBrainState(userId, dataPoint);
  const hyperfocusRisk = detectHyperfocusOnset(userId, dataPoint);

  res.json({
    success: true,
    brainState,
    hyperfocusRisk,
    recommendations: generateRecommendations(brainState, hyperfocusRisk),
    timestamp: new Date().toISOString()
  });
});

// Get current brain state prediction
router.get('/brain-state/:userId', (req, res) => {
  const { userId } = req.params;
  const userBiometrics = biometricData.filter(d => d.userId === userId).slice(-10);
  
  if (userBiometrics.length === 0) {
    return res.json({
      brainState: 'unknown',
      confidence: 0,
      message: 'No biometric data available'
    });
  }

  const brainState = analyzeBrainState(userId, userBiometrics[userBiometrics.length - 1]);
  
  res.json({
    brainState: brainState.state,
    confidence: brainState.confidence,
    indicators: brainState.indicators,
    timestamp: new Date().toISOString(),
    dataPoints: userBiometrics.length
  });
});

// Get hyperfocus risk assessment
router.get('/hyperfocus-risk/:userId', (req, res) => {
  const { userId } = req.params;
  const userBiometrics = biometricData.filter(d => d.userId === userId).slice(-20);
  
  if (userBiometrics.length < 5) {
    return res.json({
      risk: 'insufficient_data',
      level: 0,
      message: 'Need more data points for hyperfocus prediction'
    });
  }

  const hyperfocusRisk = detectHyperfocusOnset(userId, userBiometrics[userBiometrics.length - 1]);
  
  res.json({
    risk: hyperfocusRisk.level,
    probability: hyperfocusRisk.probability,
    timeToOnset: hyperfocusRisk.timeToOnset,
    indicators: hyperfocusRisk.indicators,
    interventions: hyperfocusRisk.interventions,
    timestamp: new Date().toISOString()
  });
});

// --- Pattern Analysis Functions ---

function analyzeBrainState(userId, dataPoint) {
  // ADHD-specific brain state analysis
  const indicators = {
    focus: calculateFocusLevel(dataPoint),
    stress: calculateStressLevel(dataPoint),
    fatigue: calculateFatigueLevel(dataPoint),
    hyperactivity: calculateHyperactivityLevel(dataPoint)
  };

  // Determine primary brain state
  let state = 'balanced';
  let confidence = 0.5;

  if (indicators.hyperactivity > 0.7) {
    state = 'hyperactive';
    confidence = indicators.hyperactivity;
  } else if (indicators.focus > 0.8 && indicators.stress < 0.3) {
    state = 'hyperfocus_risk';
    confidence = indicators.focus;
  } else if (indicators.stress > 0.7) {
    state = 'overwhelmed';
    confidence = indicators.stress;
  } else if (indicators.fatigue > 0.7) {
    state = 'fatigued';
    confidence = indicators.fatigue;
  } else if (indicators.focus > 0.6) {
    state = 'focused';
    confidence = indicators.focus;
  }

  return {
    state,
    confidence: Math.round(confidence * 100),
    indicators
  };
}

function detectHyperfocusOnset(userId, dataPoint) {
  const userHistory = biometricData.filter(d => d.userId === userId).slice(-15);
  
  if (userHistory.length < 10) {
    return {
      level: 'insufficient_data',
      probability: 0,
      timeToOnset: null,
      indicators: [],
      interventions: []
    };
  }

  // Analyze patterns for hyperfocus onset
  const focusTrajectory = userHistory.map(d => calculateFocusLevel(d));
  const stressTrajectory = userHistory.map(d => calculateStressLevel(d));
  const activityTrajectory = userHistory.map(d => calculateActivityLevel(d));

  // Hyperfocus indicators
  const focusIncreasing = isIncreasingTrend(focusTrajectory);
  const stressStable = isStableTrend(stressTrajectory);
  const activityDecreasing = isDecreasingTrend(activityTrajectory);
  const currentFocus = focusTrajectory[focusTrajectory.length - 1];

  let probability = 0;
  let indicators = [];
  let interventions = [];

  if (focusIncreasing && currentFocus > 0.7) {
    probability += 0.3;
    indicators.push('Sustained focus increase detected');
  }

  if (stressStable && currentFocus > 0.6) {
    probability += 0.2;
    indicators.push('Stress levels stabilizing during focus');
  }

  if (activityDecreasing && currentFocus > 0.5) {
    probability += 0.2;
    indicators.push('Physical activity decreasing');
  }

  if (dataPoint.keystrokePattern.rhythm > 0.8) {
    probability += 0.2;
    indicators.push('Consistent typing rhythm detected');
  }

  if (dataPoint.mouseMovement.velocity < 0.3) {
    probability += 0.1;
    indicators.push('Minimal mouse movement');
  }

  // Determine risk level and interventions
  let level = 'low';
  let timeToOnset = null;

  if (probability > 0.7) {
    level = 'high';
    timeToOnset = '10-15 minutes';
    interventions = [
      'Schedule a 5-minute break in 10 minutes',
      'Set hydration reminder',
      'Prepare gentle transition activities'
    ];
  } else if (probability > 0.4) {
    level = 'medium';
    timeToOnset = '20-30 minutes';
    interventions = [
      'Monitor for continued focus increase',
      'Suggest upcoming break',
      'Enable gentle notifications'
    ];
  } else {
    interventions = [
      'Continue normal monitoring',
      'Maintain current activity level'
    ];
  }

  return {
    level,
    probability: Math.round(probability * 100),
    timeToOnset,
    indicators,
    interventions
  };
}

function generateRecommendations(brainState, hyperfocusRisk) {
  const recommendations = [];

  switch (brainState.state) {
    case 'hyperactive':
      recommendations.push('Try a 2-minute breathing exercise');
      recommendations.push('Consider a short walk or movement break');
      recommendations.push('Use fidget tools if available');
      break;
    
    case 'hyperfocus_risk':
      recommendations.push('Set a timer for 25 minutes');
      recommendations.push('Prepare for a scheduled break');
      recommendations.push('Keep water nearby');
      break;
    
    case 'overwhelmed':
      recommendations.push('Break current task into smaller steps');
      recommendations.push('Use the 2-minute rule for quick wins');
      recommendations.push('Consider postponing non-urgent tasks');
      break;
    
    case 'fatigued':
      recommendations.push('Take a 10-minute rest break');
      recommendations.push('Try light stretching or movement');
      recommendations.push('Consider a healthy snack');
      break;
    
    case 'focused':
      recommendations.push('Great focus! Maintain current activity');
      recommendations.push('Stay hydrated');
      recommendations.push('Consider setting a gentle reminder for breaks');
      break;
    
    default:
      recommendations.push('Continue current activity');
      recommendations.push('Monitor your energy levels');
  }

  if (hyperfocusRisk.level === 'high') {
    recommendations.unshift('⚠️ Hyperfocus risk detected - ' + hyperfocusRisk.interventions[0]);
  }

  return recommendations;
}

// --- Helper Functions ---

function calculateFocusLevel(dataPoint) {
  const eyeFocus = (dataPoint.eyeTracking.gazeStability + (1 - dataPoint.eyeTracking.blinkRate)) / 2;
  const keyboardFocus = dataPoint.keystrokePattern.rhythm;
  const mouseFocus = 1 - dataPoint.mouseMovement.jerkiness;
  
  return (eyeFocus + keyboardFocus + mouseFocus) / 3;
}

function calculateStressLevel(dataPoint) {
  const voiceStress = (dataPoint.voiceStress.pitch + dataPoint.voiceStress.speed) / 2;
  const motorStress = dataPoint.mouseMovement.jerkiness;
  const keyboardStress = 1 - dataPoint.keystrokePattern.rhythm;
  
  return (voiceStress + motorStress + keyboardStress) / 3;
}

function calculateFatigueLevel(dataPoint) {
  const eyeFatigue = dataPoint.eyeTracking.blinkRate;
  const motorFatigue = 1 - dataPoint.mouseMovement.velocity;
  const keyboardFatigue = 1 - dataPoint.keystrokePattern.avgSpeed;
  
  return (eyeFatigue + motorFatigue + keyboardFatigue) / 3;
}

function calculateHyperactivityLevel(dataPoint) {
  const mouseHyperactivity = dataPoint.mouseMovement.velocity * dataPoint.mouseMovement.jerkiness;
  const keyboardHyperactivity = dataPoint.keystrokePattern.avgSpeed * (1 - dataPoint.keystrokePattern.rhythm);
  const voiceHyperactivity = dataPoint.voiceStress.speed * dataPoint.voiceStress.intensity;
  
  return (mouseHyperactivity + keyboardHyperactivity + voiceHyperactivity) / 3;
}

function calculateActivityLevel(dataPoint) {
  return (dataPoint.mouseMovement.velocity + dataPoint.keystrokePattern.avgSpeed) / 2;
}

function isIncreasingTrend(values) {
  if (values.length < 5) return false;
  const recent = values.slice(-5);
  const slope = calculateSlope(recent);
  return slope > 0.1;
}

function isDecreasingTrend(values) {
  if (values.length < 5) return false;
  const recent = values.slice(-5);
  const slope = calculateSlope(recent);
  return slope < -0.1;
}

function isStableTrend(values) {
  if (values.length < 5) return false;
  const recent = values.slice(-5);
  const slope = Math.abs(calculateSlope(recent));
  return slope < 0.05;
}

function calculateSlope(values) {
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
  const sumXX = values.reduce((sum, _, x) => sum + x * x, 0);
  
  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
}

module.exports = router; 
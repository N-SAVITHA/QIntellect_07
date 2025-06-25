import React, { useState } from 'react';
import axios from 'axios';
import './VoiceRecorder.css'; // Assuming you have a CSS file for styling
const VoiceRecorder = () => {
  const [manualText, setManualText] = useState('');
  const [transcription, setTranscription] = useState('');
  const [symptoms, setSymptoms] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleManualSubmit = async () => {
    if (!manualText.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5003/voice/manual-text', { text: manualText });
      setTranscription(manualText);
      setSymptoms(res.data.symptoms);
      setPrediction(res.data.prediction);
    } catch (e) {
      alert('Error: ' + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setManualText('');
    setTranscription('');
    setSymptoms(null);
    setPrediction(null);
  };

  return (
    <div
      className="voice-recorder-container"
      style={{
        padding: '32px 20px',
        maxWidth: '1200px',
        margin: '120px auto 40px auto',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}
    >
      <h2 className="symptom-heading">
        <span>Symptom Checker</span>
      </h2>
      <div className="voice-split-layout">
        <div className="voice-left-panel">
          <div className="section-card">
            <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
              <h3>Enter Your Symptoms:</h3>
              <textarea
                className="textarea-symptom"
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                placeholder="Describe your symptoms here..."
              />
              <div style={{ marginTop: '10px' }}>
                <button
                  className="button-analyze"
                  onClick={handleManualSubmit}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginRight: '10px'
                  }}
                  disabled={loading || !manualText.trim()}
                >
                  Analyze Symptoms
                </button>
                <button
                  className="button-reset"
                  onClick={resetAll}
                  style={{
                    backgroundColor: '#008CBA',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                  disabled={loading && !manualText.trim()}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="voice-right-panel">
          {loading && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <p>Processing... Please wait.</p>
            </div>
          )}

          {transcription && (
            <div className="transcription-section" style={{ marginBottom: '20px' }}>
              <h3>Entered Text:</h3>
              <div style={{
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: '#f9f9f9'
              }}>
                {transcription}
              </div>
            </div>
          )}

          {((symptoms && symptoms.length > 0) || (prediction && prediction.predictions)) && (
            <>
              {symptoms && symptoms.length > 0 && (
                <div className="detected-symptoms-section result-card">
                  <h3 style={{ color: '#1976d2', fontWeight: 600, marginBottom: 12 }}>Detected Symptoms</h3>
                  <div className="detected-symptoms-card">
                    {symptoms.map(symptom => (
                      <div key={symptom} className="detected-symptom">{symptom}</div>
                    ))}
                  </div>
                </div>
              )}
              {prediction && prediction.predictions && (
                <div className="department-cards-wrapper">
                  <h3 style={{ color: '#388e3c', fontWeight: 700, marginBottom: 12 }}>Department Recommendations</h3>
                  <div className="probability-cards">
                    {prediction.predictions.map(({ department, probability }, idx) => (
                      <div key={department} className="probability-card department-card">
                        <h4 className="probability-dept">{department}</h4>
                        <p className="probability-value">{probability.toFixed(2)}%</p>
                        {idx === 0 && (
                          <span className="recommended-badge">Top Recommendation</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
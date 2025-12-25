import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MorningTide from './MorningTide';
import FadeContent from './FadeContent';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  HelpCircle,
  Shield,
  Bell,
  Type,
  User,
  Download,
  Trash2,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Personal Identity
  const [displayName, setDisplayName] = useState('');
  const [pronouns, setPronouns] = useState('prefer-not-to-say');
  
  // Communication Preferences
  const [echoStyle, setEchoStyle] = useState('empathetic');
  const [responseLength, setResponseLength] = useState('deeper');
  
  // Mental Health Journey
  const [focusAreas, setFocusAreas] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState('');
  
  // Privacy & Safety
  const [anonymousMode, setAnonymousMode] = useState(false);
  
  // Availability & Notifications
  const [checkInReminders, setCheckInReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  
  // Accessibility
  const [textSize, setTextSize] = useState('medium');
  const [language, setLanguage] = useState('en');
  
  // Account
  const [email, setEmail] = useState(user?.email || '');
  
  // UI State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const focusAreaOptions = [
    'Stress', 'Anxiety', 'Relationships', 'Self-esteem', 
    'Sleep', 'Work-life balance', 'Grief', 'Motivation',
    'Loneliness', 'Depression', 'Anger', 'Mindfulness'
  ];

  const toggleFocusArea = (area) => {
    setFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
    showSaveToast();
  };

  const showSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleDeleteAccount = () => {
    // In production, this would call an API endpoint
    console.log('Delete account requested');
    setShowDeleteModal(false);
  };

  const handleExportData = () => {
    // In production, this would trigger a data export
    console.log('Export data requested');
    showSaveToast();
  };

  return (
    <div className="profile-page">
      <MorningTide />
      
      {/* Back Button */}
      <button 
        className="profile-back-button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Save Toast */}
      {saveToast && (
        <div className="save-toast">
          <Check size={18} />
          <span>Changes saved</span>
        </div>
      )}

      <div className="profile-container">
        <FadeContent delay={0} duration={0.6} threshold={0.1}>
          <header className="profile-header">
            <h1 className="profile-title">Your Safe Space Settings</h1>
            <p className="profile-subtitle">
              Customize how Echo supports you on your journey
            </p>
          </header>
        </FadeContent>

        <div className="profile-sections">
          {/* Personal Identity Section */}
          <FadeContent delay={100} duration={0.6} threshold={0.1}>
            <section className="settings-card">
              <div className="card-header">
                <User size={24} className="card-icon" />
                <h2 className="card-title">Personal Identity</h2>
              </div>
              
              <div className="form-group">
                <label htmlFor="displayName" className="form-label">
                  What should Echo call you?
                </label>
                <input
                  type="text"
                  id="displayName"
                  className="form-input"
                  value={displayName}
                  onChange={(e) => { setDisplayName(e.target.value); showSaveToast(); }}
                  placeholder="Enter your name or nickname"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pronouns" className="form-label">
                  Your pronouns
                </label>
                <select
                  id="pronouns"
                  className="form-select"
                  value={pronouns}
                  onChange={(e) => { setPronouns(e.target.value); showSaveToast(); }}
                >
                  <option value="she-her">She/Her</option>
                  <option value="he-him">He/Him</option>
                  <option value="they-them">They/Them</option>
                  <option value="custom">Custom</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </section>
          </FadeContent>

          {/* Communication Preferences Section */}
          <FadeContent delay={200} duration={0.6} threshold={0.1}>
            <section className="settings-card">
              <div className="card-header">
                <Sparkles size={24} className="card-icon" />
                <h2 className="card-title">Communication Preferences</h2>
              </div>
              
              <div className="form-group">
                <label className="form-label">Echo's conversation style</label>
                <div className="style-cards">
                  <button
                    className={`style-card ${echoStyle === 'empathetic' ? 'active' : ''}`}
                    onClick={() => { setEchoStyle('empathetic'); showSaveToast(); }}
                  >
                    <Heart size={28} className="style-icon" />
                    <span className="style-name">Empathetic Listener</span>
                    <span className="style-desc">Warm and understanding</span>
                  </button>
                  
                  <button
                    className={`style-card ${echoStyle === 'encourager' ? 'active' : ''}`}
                    onClick={() => { setEchoStyle('encourager'); showSaveToast(); }}
                  >
                    <Sparkles size={28} className="style-icon" />
                    <span className="style-name">Gentle Encourager</span>
                    <span className="style-desc">Supportive and uplifting</span>
                  </button>
                  
                  <button
                    className={`style-card ${echoStyle === 'questioner' ? 'active' : ''}`}
                    onClick={() => { setEchoStyle('questioner'); showSaveToast(); }}
                  >
                    <HelpCircle size={28} className="style-icon" />
                    <span className="style-name">Thoughtful Questioner</span>
                    <span className="style-desc">Curious and reflective</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Response preference</label>
                <div className="toggle-group">
                  <button
                    className={`toggle-option ${responseLength === 'brief' ? 'active' : ''}`}
                    onClick={() => { setResponseLength('brief'); showSaveToast(); }}
                  >
                    Brief check-ins
                  </button>
                  <button
                    className={`toggle-option ${responseLength === 'deeper' ? 'active' : ''}`}
                    onClick={() => { setResponseLength('deeper'); showSaveToast(); }}
                  >
                    Deeper conversations
                  </button>
                </div>
              </div>
            </section>
          </FadeContent>

          {/* Mental Health Journey Section */}
          <FadeContent delay={300} duration={0.6} threshold={0.1}>
            <section className="settings-card">
              <div className="card-header">
                <Heart size={24} className="card-icon" />
                <h2 className="card-title">Mental Health Journey</h2>
              </div>
              
              <div className="form-group">
                <label className="form-label">Focus areas (select all that apply)</label>
                <div className="chips-container">
                  {focusAreaOptions.map(area => (
                    <button
                      key={area}
                      className={`chip ${focusAreas.includes(area) ? 'active' : ''}`}
                      onClick={() => toggleFocusArea(area)}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="weeklyGoal" className="form-label">
                  This week's intention
                </label>
                <textarea
                  id="weeklyGoal"
                  className="form-textarea"
                  value={weeklyGoal}
                  onChange={(e) => { setWeeklyGoal(e.target.value); showSaveToast(); }}
                  placeholder="What would you like to focus on this week?"
                  rows={3}
                />
              </div>

              {weeklyGoal && (
                <div className="goal-display">
                  <div className="goal-label">Your current intention:</div>
                  <div className="goal-text">{weeklyGoal}</div>
                </div>
              )}
            </section>
          </FadeContent>

          {/* Privacy & Safety Section */}
          <FadeContent delay={400} duration={0.6} threshold={0.1}>
            <section className="settings-card">
              <div className="card-header">
                <Shield size={24} className="card-icon" />
                <h2 className="card-title">Privacy & Safety</h2>
              </div>
              
              <div className="form-group">
                <div className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Anonymous mode</span>
                    <span className="toggle-desc">Hide personal info from conversations</span>
                  </div>
                  <button
                    className={`toggle-switch ${anonymousMode ? 'active' : ''}`}
                    onClick={() => { setAnonymousMode(!anonymousMode); showSaveToast(); }}
                    aria-label="Toggle anonymous mode"
                  >
                    <span className="toggle-thumb" />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <button 
                  className="crisis-button"
                  onClick={() => window.open('https://988lifeline.org/', '_blank')}
                >
                  <Shield size={20} />
                  <span>Crisis Resources</span>
                  <ExternalLink size={16} />
                </button>
                <p className="form-hint">
                  24/7 support available. You're never alone.
                </p>
              </div>

              <div className="form-group">
                <a href="/privacy" className="privacy-link">
                  View Privacy Policy
                </a>
              </div>
            </section>
          </FadeContent>

          {/* Availability & Notifications Section */}
          <FadeContent delay={500} duration={0.6} threshold={0.1}>
            <section className="settings-card">
              <div className="card-header">
                <Bell size={24} className="card-icon" />
                <h2 className="card-title">Availability & Notifications</h2>
              </div>
              
              <div className="form-group">
                <div className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Check-in reminders</span>
                    <span className="toggle-desc">Gentle nudges to chat with Echo</span>
                  </div>
                  <button
                    className={`toggle-switch ${checkInReminders ? 'active' : ''}`}
                    onClick={() => { setCheckInReminders(!checkInReminders); showSaveToast(); }}
                    aria-label="Toggle check-in reminders"
                  >
                    <span className="toggle-thumb" />
                  </button>
                </div>
                
                {checkInReminders && (
                  <div className="time-picker-row">
                    <label htmlFor="reminderTime">Preferred time:</label>
                    <input
                      type="time"
                      id="reminderTime"
                      className="form-time"
                      value={reminderTime}
                      onChange={(e) => { setReminderTime(e.target.value); showSaveToast(); }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <div className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Quiet hours</span>
                    <span className="toggle-desc">Pause notifications during rest</span>
                  </div>
                  <button
                    className={`toggle-switch ${quietHoursEnabled ? 'active' : ''}`}
                    onClick={() => { setQuietHoursEnabled(!quietHoursEnabled); showSaveToast(); }}
                    aria-label="Toggle quiet hours"
                  >
                    <span className="toggle-thumb" />
                  </button>
                </div>
                
                {quietHoursEnabled && (
                  <div className="time-range-row">
                    <div className="time-input-group">
                      <label htmlFor="quietStart">Start:</label>
                      <input
                        type="time"
                        id="quietStart"
                        className="form-time"
                        value={quietHoursStart}
                        onChange={(e) => { setQuietHoursStart(e.target.value); showSaveToast(); }}
                      />
                    </div>
                    <div className="time-input-group">
                      <label htmlFor="quietEnd">End:</label>
                      <input
                        type="time"
                        id="quietEnd"
                        className="form-time"
                        value={quietHoursEnd}
                        onChange={(e) => { setQuietHoursEnd(e.target.value); showSaveToast(); }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </FadeContent>

          {/* Accessibility Section */}
          <FadeContent delay={600} duration={0.6} threshold={0.1}>
            <section className="settings-card">
              <div className="card-header">
                <Type size={24} className="card-icon" />
                <h2 className="card-title">Accessibility</h2>
              </div>
              
              <div className="form-group">
                <label className="form-label">Text size</label>
                <div className="size-slider-container">
                  <span className="size-label small">A</span>
                  <div className="size-options">
                    {['small', 'medium', 'large', 'extra-large'].map(size => (
                      <button
                        key={size}
                        className={`size-option ${textSize === size ? 'active' : ''}`}
                        onClick={() => { setTextSize(size); showSaveToast(); }}
                        aria-label={`${size} text size`}
                      >
                        <span className="size-dot" />
                      </button>
                    ))}
                  </div>
                  <span className="size-label large">A</span>
                </div>
                <div className="size-indicator">{textSize.replace('-', ' ')}</div>
              </div>

              <div className="form-group">
                <label htmlFor="language" className="form-label">
                  Language
                </label>
                <select
                  id="language"
                  className="form-select"
                  value={language}
                  onChange={(e) => { setLanguage(e.target.value); showSaveToast(); }}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="pt">Português</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
            </section>
          </FadeContent>

          {/* Account Management Section */}
          <FadeContent delay={700} duration={0.6} threshold={0.1}>
            <section className="settings-card">
              <div className="card-header">
                <User size={24} className="card-icon" />
                <h2 className="card-title">Account Management</h2>
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
                <p className="form-hint">Used for account recovery only</p>
              </div>

              <div className="form-group">
                <button className="export-button" onClick={handleExportData}>
                  <Download size={20} />
                  <span>Export Your Reflections</span>
                </button>
              </div>

              <div className="form-group">
                <button 
                  className="delete-button"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={20} />
                  <span>Delete Account</span>
                </button>
              </div>
            </section>
          </FadeContent>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <div className="modal-icon">
              <Trash2 size={40} />
            </div>
            <h3 className="modal-title">Delete Your Account?</h3>
            <p className="modal-text">
              This action cannot be undone. All your conversations and settings will be permanently removed.
            </p>
            <div className="modal-actions">
              <button 
                className="modal-button cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Keep My Account
              </button>
              <button 
                className="modal-button confirm"
                onClick={handleDeleteAccount}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

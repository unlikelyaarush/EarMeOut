import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../lib/profileService';
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
  const [isLoading, setIsLoading] = useState(true);
  const [saveTimeout, setSaveTimeout] = useState(null);

  const focusAreaOptions = [
    'Stress', 'Anxiety', 'Relationships', 'Self-esteem', 
    'Sleep', 'Work-life balance', 'Grief', 'Motivation',
    'Loneliness', 'Depression', 'Anger', 'Mindfulness'
  ];

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        let profile = await profileService.getProfile(user.id);
        
        // If no profile exists, create one
        if (!profile) {
          profile = await profileService.initializeProfile(user.id, user.email);
        }
        
        // Set state from profile data
        if (profile) {
          setDisplayName(profile.display_name || '');
          setPronouns(profile.pronouns || 'prefer-not-to-say');
          setEchoStyle(profile.echo_style || 'empathetic');
          setResponseLength(profile.response_length || 'deeper');
          setFocusAreas(profile.focus_areas || []);
          setWeeklyGoal(profile.weekly_goal || '');
          setAnonymousMode(profile.anonymous_mode || false);
          setCheckInReminders(profile.check_in_reminders ?? true);
          setReminderTime(profile.reminder_time || '09:00');
          setQuietHoursEnabled(profile.quiet_hours_enabled || false);
          setQuietHoursStart(profile.quiet_hours_start || '22:00');
          setQuietHoursEnd(profile.quiet_hours_end || '08:00');
          setTextSize(profile.text_size || 'medium');
          setLanguage(profile.language || 'en');
          setEmail(profile.email || user.email || '');
          
          // Apply saved text size
          applyTextSize(profile.text_size || 'medium');
        }
      } catch (error) {
        console.error('Failed to load profile:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId: user?.id
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Apply text size globally
  const applyTextSize = (size) => {
    const root = document.documentElement;
    const sizes = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    root.style.fontSize = sizes[size] || '16px';
  };

  // Debounced save function
  const saveProfileData = async (updates) => {
    if (!user) {
      console.warn('Cannot save profile: user not authenticated');
      return;
    }

    // Clear existing timeout
    if (saveTimeout) clearTimeout(saveTimeout);

    // Set new timeout
    const timeout = setTimeout(async () => {
      try {
        await profileService.updateProfile(user.id, updates);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2000);
      } catch (error) {
        console.error('Failed to save profile:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          updates,
          userId: user.id
        });
        // Show error toast instead of success toast
        // You could add an error toast state here if desired
      }
    }, 800);

    setSaveTimeout(timeout);
  };

  // Handler functions
  const handleDisplayNameChange = (value) => {
    setDisplayName(value);
    saveProfileData({ display_name: value });
  };

  const handlePronounsChange = (value) => {
    setPronouns(value);
    saveProfileData({ pronouns: value });
  };

  const handleEchoStyleChange = (value) => {
    setEchoStyle(value);
    saveProfileData({ echo_style: value });
  };

  const handleResponseLengthChange = (value) => {
    setResponseLength(value);
    saveProfileData({ response_length: value });
  };

  const handleWeeklyGoalChange = (value) => {
    setWeeklyGoal(value);
    saveProfileData({ weekly_goal: value });
  };

  const handleAnonymousModeChange = (value) => {
    setAnonymousMode(value);
    saveProfileData({ anonymous_mode: value });
  };

  const handleCheckInRemindersChange = (value) => {
    setCheckInReminders(value);
    saveProfileData({ check_in_reminders: value });
  };

  const handleReminderTimeChange = (value) => {
    setReminderTime(value);
    saveProfileData({ reminder_time: value });
  };

  const handleQuietHoursEnabledChange = (value) => {
    setQuietHoursEnabled(value);
    saveProfileData({ quiet_hours_enabled: value });
  };

  const handleQuietHoursStartChange = (value) => {
    setQuietHoursStart(value);
    saveProfileData({ quiet_hours_start: value });
  };

  const handleQuietHoursEndChange = (value) => {
    setQuietHoursEnd(value);
    saveProfileData({ quiet_hours_end: value });
  };

  const handleTextSizeChange = (value) => {
    setTextSize(value);
    saveProfileData({ text_size: value });
    applyTextSize(value);
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    saveProfileData({ language: value });
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    saveProfileData({ email: value });
  };

  const toggleFocusArea = (area) => {
    const newFocusAreas = focusAreas.includes(area)
      ? focusAreas.filter(a => a !== area)
      : [...focusAreas, area];
    
    setFocusAreas(newFocusAreas);
    saveProfileData({ focus_areas: newFocusAreas });
  };

  const handleDeleteAccount = () => {
    // In production, this would call an API endpoint
    setShowDeleteModal(false);
  };

  const handleExportData = () => {
    // In production, this would trigger a data export
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="profile-page">
        <MorningTide />
        <div className="profile-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading your settings...
        </div>
      </div>
    );
  }

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
                  onChange={(e) => handleDisplayNameChange(e.target.value)}
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
                  onChange={(e) => handlePronounsChange(e.target.value)}
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
                    onClick={() => handleEchoStyleChange('empathetic')}
                  >
                    <Heart size={28} className="style-icon" />
                    <span className="style-name">Empathetic Listener</span>
                    <span className="style-desc">Warm and understanding</span>
                  </button>
                  
                  <button
                    className={`style-card ${echoStyle === 'encourager' ? 'active' : ''}`}
                    onClick={() => handleEchoStyleChange('encourager')}
                  >
                    <Sparkles size={28} className="style-icon" />
                    <span className="style-name">Gentle Encourager</span>
                    <span className="style-desc">Supportive and uplifting</span>
                  </button>
                  
                  <button
                    className={`style-card ${echoStyle === 'questioner' ? 'active' : ''}`}
                    onClick={() => handleEchoStyleChange('questioner')}
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
                    onClick={() => handleResponseLengthChange('brief')}
                  >
                    Brief check-ins
                  </button>
                  <button
                    className={`toggle-option ${responseLength === 'deeper' ? 'active' : ''}`}
                    onClick={() => handleResponseLengthChange('deeper')}
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
                  onChange={(e) => handleWeeklyGoalChange(e.target.value)}
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
                    onClick={() => handleAnonymousModeChange(!anonymousMode)}
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
                    onClick={() => handleCheckInRemindersChange(!checkInReminders)}
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
                      onChange={(e) => handleReminderTimeChange(e.target.value)}
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
                    onClick={() => handleQuietHoursEnabledChange(!quietHoursEnabled)}
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
                        onChange={(e) => handleQuietHoursStartChange(e.target.value)}
                      />
                    </div>
                    <div className="time-input-group">
                      <label htmlFor="quietEnd">End:</label>
                      <input
                        type="time"
                        id="quietEnd"
                        className="form-time"
                        value={quietHoursEnd}
                        onChange={(e) => handleQuietHoursEndChange(e.target.value)}
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
                        onClick={() => handleTextSizeChange(size)}
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
                  onChange={(e) => handleLanguageChange(e.target.value)}
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
                  onChange={(e) => handleEmailChange(e.target.value)}
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
import React from 'react';
import Navigation from './Navigation';
import Iridescence from './Iridescence';
import Footer from './Footer';
import './Page.css';
import './Team.css';

const Team = () => {
  // Team member data - easily add images by replacing the imageUrl with actual paths
  const teamMembers = [
    {
      id: 1,
      name: 'Team Member 1',
      role: 'Role/Position',
      imageUrl: '', // Add image path here: '/images/team/member1.jpg'
      bio: 'Add a brief bio or description here.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 2,
      name: 'Team Member 2',
      role: 'Role/Position',
      imageUrl: '', // Add image path here: '/images/team/member2.jpg'
      bio: 'Add a brief bio or description here.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 3,
      name: 'Team Member 3',
      role: 'Role/Position',
      imageUrl: '', // Add image path here: '/images/team/member3.jpg'
      bio: 'Add a brief bio or description here.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 4,
      name: 'Team Member 4',
      role: 'Role/Position',
      imageUrl: '', // Add image path here: '/images/team/member4.jpg'
      bio: 'Add a brief bio or description here.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 5,
      name: 'Team Member 5',
      role: 'Role/Position',
      imageUrl: '', // Add image path here: '/images/team/member5.jpg'
      bio: 'Add a brief bio or description here.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 6,
      name: 'Team Member 6',
      role: 'Role/Position',
      imageUrl: '', // Add image path here: '/images/team/member6.jpg'
      bio: 'Add a brief bio or description here.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    }
  ];

  return (
    <div className="page">
      <Iridescence
        color={[0, .3, .5]}
        mouseReact={false}
        amplitude={0.1}
        speed={.4}
      />
      <Navigation />
      <div className="page-content team-page-content">
        <h1 className="page-title">Our Team</h1>
        <p className="team-subtitle">Meet the amazing people behind EarMeOut</p>
        
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-card-inner">
                <div className="team-image-wrapper">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="team-image"
                    />
                  ) : (
                    <div className="team-image-placeholder">
                      <span className="placeholder-icon">👤</span>
                    </div>
                  )}
                  <div className="team-image-overlay"></div>
                </div>
                
                <div className="team-card-content">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                  
                  <div className="team-social">
                    <a 
                      href={member.social.linkedin} 
                      className="social-link"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a 
                      href={member.social.twitter} 
                      className="social-link"
                      aria-label={`${member.name} Twitter`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      </svg>
                    </a>
                    <a 
                      href={member.social.github} 
                      className="social-link"
                      aria-label={`${member.name} GitHub`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Team;

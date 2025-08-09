// Sample timeline data for employees
export const generateEmployeeTimeline = (employee) => {
  const hireDate = new Date(employee.hireDate);
  const currentDate = new Date();
  
  // Base timeline events that every employee should have
  const baseEvents = [
    {
      id: 1,
      type: 'hire',
      title: 'Joined Company',
      description: `Started as ${employee.position} in ${employee.department} department`,
      date: employee.hireDate,
      status: 'completed',
      details: ['Onboarding completed', 'Initial training', 'Equipment setup'],
      impact: 'Successfully integrated into the team'
    }
  ];

  // Generate additional events based on tenure
  const additionalEvents = [];
  const yearsOfService = Math.floor((currentDate - hireDate) / (365.25 * 24 * 60 * 60 * 1000));

  // Add performance reviews (annually)
  for (let year = 1; year <= yearsOfService; year++) {
    const reviewDate = new Date(hireDate);
    reviewDate.setFullYear(reviewDate.getFullYear() + year);
    
    if (reviewDate <= currentDate) {
      additionalEvents.push({
        id: `review-${year}`,
        type: 'performance',
        title: `Annual Performance Review ${hireDate.getFullYear() + year}`,
        description: `Performance evaluation and goal setting for year ${year}`,
        date: reviewDate.toISOString().split('T')[0],
        status: 'completed',
        details: [`Rating: ${employee.performanceRating || 75}%`, 'Goals achieved', 'Development plan updated'],
        impact: 'Performance goals met and new objectives set'
      });
    }
  }

  // Add training events
  if (yearsOfService >= 1) {
    const trainingDate = new Date(hireDate);
    trainingDate.setMonth(trainingDate.getMonth() + 6);
    
    additionalEvents.push({
      id: 'training-1',
      type: 'training',
      title: 'Professional Development Training',
      description: 'Completed advanced skills training program',
      date: trainingDate.toISOString().split('T')[0],
      status: 'completed',
      details: employee.certifications || ['Leadership Skills', 'Technical Training'],
      impact: 'Enhanced technical and soft skills'
    });
  }

  // Add promotion if senior position
  if (employee.position.toLowerCase().includes('senior') || employee.position.toLowerCase().includes('lead') || employee.position.toLowerCase().includes('manager')) {
    const promotionDate = new Date(hireDate);
    promotionDate.setFullYear(promotionDate.getFullYear() + Math.max(1, Math.floor(yearsOfService / 2)));
    
    if (promotionDate <= currentDate) {
      additionalEvents.push({
        id: 'promotion-1',
        type: 'promotion',
        title: 'Promotion',
        description: `Promoted to ${employee.position}`,
        date: promotionDate.toISOString().split('T')[0],
        status: 'completed',
        details: ['Increased responsibilities', 'Salary adjustment', 'Team leadership'],
        impact: 'Expanded role and increased contribution to company success'
      });
    }
  }

  // Add project milestones
  const projectEvents = [
    {
      id: 'project-1',
      type: 'project',
      title: 'Major Project Completion',
      description: 'Successfully delivered key project ahead of schedule',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 15).toISOString().split('T')[0],
      status: 'completed',
      details: ['On-time delivery', 'Budget adherence', 'Quality standards met'],
      impact: 'Contributed to 15% increase in team productivity'
    }
  ];

  // Add achievement
  if (employee.performanceRating && employee.performanceRating > 80) {
    additionalEvents.push({
      id: 'achievement-1',
      type: 'achievement',
      title: 'Excellence Award',
      description: 'Recognized for outstanding performance and dedication',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 10).toISOString().split('T')[0],
      status: 'completed',
      details: ['Top performer', 'Customer satisfaction', 'Innovation'],
      impact: 'Set benchmark for team performance standards'
    });
  }

  // Add recent leave if applicable
  if (employee.status === 'On Leave') {
    additionalEvents.push({
      id: 'leave-1',
      type: 'leave',
      title: 'Leave of Absence',
      description: 'Currently on approved leave',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
      status: 'in-progress',
      details: ['Approved duration', 'Temporary coverage arranged'],
      impact: 'Maintaining work-life balance'
    });
  }

  // Add upcoming events
  const upcomingEvents = [
    {
      id: 'upcoming-review',
      type: 'review',
      title: 'Upcoming Performance Review',
      description: 'Scheduled performance evaluation and goal setting',
      date: employee.nextReviewDate || new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0],
      status: 'pending',
      details: ['Performance assessment', 'Goal setting', 'Career planning'],
      impact: 'Career development and growth planning'
    }
  ];

  // Combine all events and sort by date
  const allEvents = [...baseEvents, ...additionalEvents, ...projectEvents, ...upcomingEvents]
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return allEvents;
};

// Sample timeline data for different employee types
export const sampleTimelineData = {
  // Senior employee with long tenure
  senior: [
    {
      id: 1,
      type: 'hire',
      title: 'Joined Company',
      description: 'Started as Junior Developer in Engineering department',
      date: '2020-01-15',
      status: 'completed',
      details: ['Onboarding completed', 'Initial training', 'Equipment setup'],
      impact: 'Successfully integrated into the development team'
    },
    {
      id: 2,
      type: 'training',
      title: 'Technical Certification',
      description: 'Completed AWS Cloud Practitioner certification',
      date: '2020-07-20',
      status: 'completed',
      details: ['AWS Certified', 'Cloud Architecture', 'Best Practices'],
      impact: 'Enhanced cloud development capabilities'
    },
    {
      id: 3,
      type: 'performance',
      title: 'Annual Performance Review 2021',
      description: 'Exceeded performance expectations with 85% rating',
      date: '2021-01-15',
      status: 'completed',
      details: ['Rating: 85%', 'Goals exceeded', 'Leadership potential identified'],
      impact: 'Recognized as high-potential employee'
    },
    {
      id: 4,
      type: 'promotion',
      title: 'Promotion to Senior Developer',
      description: 'Promoted to Senior Software Engineer role',
      date: '2021-06-01',
      status: 'completed',
      details: ['Increased responsibilities', '20% salary increase', 'Mentoring junior developers'],
      impact: 'Leading technical initiatives and mentoring team members'
    },
    {
      id: 5,
      type: 'project',
      title: 'Major System Migration',
      description: 'Led successful migration of legacy system to cloud infrastructure',
      date: '2022-03-15',
      status: 'completed',
      details: ['Zero downtime migration', 'Cost reduction: 30%', 'Performance improvement: 50%'],
      impact: 'Saved company $100K annually in infrastructure costs'
    },
    {
      id: 6,
      type: 'achievement',
      title: 'Innovation Award',
      description: 'Received company-wide innovation award for process improvements',
      date: '2022-12-10',
      status: 'completed',
      details: ['Process automation', 'Efficiency gains', 'Team collaboration'],
      impact: 'Improved team productivity by 25%'
    },
    {
      id: 7,
      type: 'performance',
      title: 'Annual Performance Review 2023',
      description: 'Outstanding performance with 90% rating',
      date: '2023-01-15',
      status: 'completed',
      details: ['Rating: 90%', 'Exceeded all goals', 'Leadership excellence'],
      impact: 'Identified for leadership development program'
    },
    {
      id: 8,
      type: 'training',
      title: 'Leadership Development Program',
      description: 'Completed 6-month leadership development program',
      date: '2023-08-30',
      status: 'completed',
      details: ['Management skills', 'Strategic thinking', 'Team building'],
      impact: 'Prepared for management responsibilities'
    },
    {
      id: 9,
      type: 'review',
      title: 'Upcoming Performance Review',
      description: 'Scheduled annual performance review and promotion discussion',
      date: '2024-01-15',
      status: 'pending',
      details: ['Performance assessment', 'Promotion consideration', 'Career planning'],
      impact: 'Potential advancement to team lead position'
    }
  ],

  // New employee
  junior: [
    {
      id: 1,
      type: 'hire',
      title: 'Joined Company',
      description: 'Started as Software Engineer in Engineering department',
      date: '2023-02-14',
      status: 'completed',
      details: ['Onboarding completed', 'Initial training', 'Equipment setup'],
      impact: 'Successfully integrated into the development team'
    },
    {
      id: 2,
      type: 'training',
      title: 'Onboarding Program',
      description: 'Completed comprehensive 2-week onboarding program',
      date: '2023-02-28',
      status: 'completed',
      details: ['Company culture', 'Technical stack', 'Development processes'],
      impact: 'Quickly became productive team member'
    },
    {
      id: 3,
      type: 'project',
      title: 'First Project Assignment',
      description: 'Successfully completed first project assignment',
      date: '2023-05-15',
      status: 'completed',
      details: ['Bug fixes', 'Feature implementation', 'Code review process'],
      impact: 'Demonstrated technical competency and attention to detail'
    },
    {
      id: 4,
      type: 'milestone',
      title: '6-Month Milestone',
      description: 'Successfully completed probationary period',
      date: '2023-08-14',
      status: 'completed',
      details: ['Performance goals met', 'Team integration', 'Skill development'],
      impact: 'Confirmed as permanent team member'
    },
    {
      id: 5,
      type: 'training',
      title: 'Advanced JavaScript Training',
      description: 'Completed advanced JavaScript and React training course',
      date: '2023-10-20',
      status: 'completed',
      details: ['Modern JavaScript', 'React best practices', 'Testing frameworks'],
      impact: 'Enhanced frontend development capabilities'
    },
    {
      id: 6,
      type: 'review',
      title: 'First Annual Review',
      description: 'Scheduled first annual performance review',
      date: '2024-02-14',
      status: 'pending',
      details: ['Performance assessment', 'Goal setting', 'Career development'],
      impact: 'Career growth planning and skill development roadmap'
    }
  ]
};
// Initialize Supabase
const supabaseUrl = 'https://zcmreyyamzemiehlyxbo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjbXJleXlhbXplbWllaGx5eGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMDMwNzMsImV4cCI6MjA3MzU3OTA3M30.EHuM0BK22U7XFCKQux-CuXB6oiSzG4HyxT_CumHsBUk';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Check if user is authenticated using localStorage
function checkAuth() {
  const isLoggedIn = localStorage.getItem('loggedIn');
  
  if (!isLoggedIn || isLoggedIn !== 'true') {
    // User is not authenticated, redirect to login page
    window.location.href = 'index.html';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  showToast('Logged out successfully', 'success');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                     type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
                     type === 'warning' ? '<i class="fas fa-exclamation-triangle"></i>' :
                     '<i class="fas fa-info-circle"></i>'} ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Mobile menu toggle
document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile menu when a nav link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    // Close mobile menu
    document.querySelector('.nav-links').classList.remove('active');
  });
});

// Tab navigation
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = link.getAttribute('data-tab');
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Show corresponding tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    // Load data for the tab if needed
    if (tabId === 'dashboard') {
      loadDashboardData();
    } else if (tabId === 'sermons') {
      loadSermons();
    } else if (tabId === 'fellowships') {
      loadFellowships();
    } else if (tabId === 'events') {
      loadEvents();
    } else if (tabId === 'media') {
      loadMedia();
    } else if (tabId === 'attendance') {
      loadAttendance();
    } else if (tabId === 'youth') {
      loadYouth();
    } else if (tabId === 'elders') {
      loadElders();
    } else if (tabId === 'songs') {
      loadSongs();
    }
  });
});

// Sub-tab navigation
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const contentId = tab.getAttribute('data-content');
    const parentTab = tab.closest('.tab-content').id;
    
    // Update active sub-tab
    tab.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Show corresponding sub-tab content
    document.querySelectorAll(`#${parentTab} .tab-content`).forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(contentId).classList.add('active');
    
    // Load specific data if needed
    if (parentTab === 'attendance' && contentId === 'attendance-chart') {
      renderAttendanceCharts();
    }
  });
});

// Media preview
function setupMediaPreview(inputId, previewId) {
  document.getElementById(inputId)?.addEventListener('change', function(e) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = '';
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const element = file.type.startsWith('image')
          ? document.createElement('img')
          : document.createElement('video');
        element.src = reader.result;
        if (element.tagName === 'VIDEO') element.controls = true;
        preview.appendChild(element);
      };
      reader.readAsDataURL(file);
    });
  });
}

setupMediaPreview('eventMedia', 'eventPreview');
setupMediaPreview('mediaFile', 'mediaPreview');

// Load dashboard data
async function loadDashboardData() {
  try {
    // Get sermon count
    const { data: sermons, error: sermonsError } = await supabase
      .from('sermons')
      .select('id');
    
    if (sermonsError) throw sermonsError;
    document.getElementById('sermonCount').textContent = sermons?.length || 0;
    
    // Get fellowship count
    const { data: fellowships, error: fellowshipsError } = await supabase
      .from('fellowships')
      .select('id');
    
    if (fellowshipsError) throw fellowshipsError;
    document.getElementById('fellowshipCount').textContent = fellowships?.length || 0;
    
    // Get event count (upcoming events)
    const today = new Date().toISOString().split('T')[0];
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id')
      .gte('date', today);
    
    if (eventsError) throw eventsError;
    document.getElementById('eventCount').textContent = events?.length || 0;
    
    // Get media count
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .select('id');
    
    if (mediaError) throw mediaError;
    document.getElementById('mediaCount').textContent = media?.length || 0;
    
    // Get youth count
    const { data: youth, error: youthError } = await supabase
      .from('youth')
      .select('id');
    
    if (youthError) throw youthError;
    document.getElementById('youthCount').textContent = youth?.length || 0;
    
    // Get elders count
    const { data: elders, error: eldersError } = await supabase
      .from('elders')
      .select('id');
    
    if (eldersError) throw eldersError;
    document.getElementById('eldersCount').textContent = elders?.length || 0;
    
    // Get songs count
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('id');
    
    if (songsError) throw songsError;
    document.getElementById('songsCount').textContent = songs?.length || 0;
    
    // Get average Sunday attendance
    const { data: attendance, error: attendanceError } = await supabase
      .from('attendance')
      .select('men, women, youth, children, visitors');
    
    if (attendanceError) throw attendanceError;
    
    if (attendance && attendance.length > 0) {
      const totalAttendance = attendance.reduce((sum, record) => {
        return sum + (record.men || 0) + (record.women || 0) + (record.youth || 0) + 
                     (record.children || 0) + (record.visitors || 0);
      }, 0);
      const avgAttendance = Math.round(totalAttendance / attendance.length);
      document.getElementById('avgAttendance').textContent = avgAttendance;
    } else {
      document.getElementById('avgAttendance').textContent = '0';
    }
    
    // Load recent activities
    loadRecentActivities();
    
    // Render dashboard chart
    renderDashboardChart();
  } catch (error) {
    showToast(`Error loading dashboard: ${error.message}`, 'error');
  }
}

// Render dashboard chart
function renderDashboardChart() {
  const ctx = document.getElementById('attendanceChart');
  if (!ctx) return;
  
  // Get last 4 weeks of attendance data
  const today = new Date();
  const fourWeeksAgo = new Date(today);
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  
  supabase
    .from('attendance')
    .select('date, men, women, youth, children, visitors')
    .gte('date', fourWeeksAgo.toISOString().split('T')[0])
    .order('date', { ascending: true })
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching attendance data:', error);
        return;
      }
      
      const labels = [];
      const menData = [];
      const womenData = [];
      const youthData = [];
      const childrenData = [];
      const visitorsData = [];
      
      data.forEach(record => {
        const date = new Date(record.date);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        menData.push(record.men || 0);
        womenData.push(record.women || 0);
        youthData.push(record.youth || 0);
        childrenData.push(record.children || 0);
        visitorsData.push(record.visitors || 0);
      });
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Men',
              data: menData,
              borderColor: '#4a6de5',
              backgroundColor: 'rgba(74, 109, 229, 0.1)',
              tension: 0.3
            },
            {
              label: 'Women',
              data: womenData,
              borderColor: '#f85a5a',
              backgroundColor: 'rgba(248, 90, 90, 0.1)',
              tension: 0.3
            },
            {
              label: 'Youth',
              data: youthData,
              borderColor: '#4cd3c2',
              backgroundColor: 'rgba(76, 211, 194, 0.1)',
              tension: 0.3
            },
            {
              label: 'Children',
              data: childrenData,
              borderColor: '#f57c00',
              backgroundColor: 'rgba(245, 124, 0, 0.1)',
              tension: 0.3
            },
            {
              label: 'Visitors',
              data: visitorsData,
              borderColor: '#0288d1',
              backgroundColor: 'rgba(2, 136, 209, 0.1)',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Church Attendance Trend (Last 4 Weeks)'
            },
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of People'
              }
            }
          }
        }
      });
    });
}

// Load recent activities
async function loadRecentActivities() {
  try {
    // Get recent sermons
    const { data: recentSermons, error: sermonsError } = await supabase
      .from('sermons')
      .select('title, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    
    // Get recent events
    const { data: recentEvents, error: eventsError } = await supabase
      .from('events')
      .select('name, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    
    // Get recent media
    const { data: recentMedia, error: mediaError } = await supabase
      .from('media')
      .select('title, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    
    // Get recent attendance
    const { data: recentAttendance, error: attendanceError } = await supabase
      .from('attendance')
      .select('date, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (sermonsError || eventsError || mediaError || attendanceError) {
      throw new Error('Error loading recent activities');
    }
    
    // Combine and sort activities
    const activities = [
      ...(recentSermons || []).map(item => ({...item, type: 'sermon', icon: 'fa-book'})),
      ...(recentEvents || []).map(item => ({...item, type: 'event', icon: 'fa-calendar'})),
      ...(recentMedia || []).map(item => ({...item, type: 'media', icon: 'fa-photo-video'})),
      ...(recentAttendance || []).map(item => ({...item, type: 'attendance', icon: 'fa-chart-bar', title: 'Attendance recorded'}))
    ];
    
    activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Display activities
    const activitiesContainer = document.getElementById('recentActivities');
    activitiesContainer.innerHTML = '';
    
    if (activities.length === 0) {
      activitiesContainer.innerHTML = '<p style="text-align: center; color: var(--text-light);">No recent activities</p>';
      return;
    }
    
    activities.slice(0, 5).forEach(activity => {
      const activityEl = document.createElement('div');
      activityEl.className = 'activity-item';
      activityEl.style.padding = '12px';
      activityEl.style.marginBottom = '10px';
      activityEl.style.background = 'rgba(255, 255, 255, 0.7)';
      activityEl.style.borderRadius = '8px';
      activityEl.style.display = 'flex';
      activityEl.style.alignItems = 'center';
      activityEl.style.gap = '12px';
      
      const iconEl = document.createElement('div');
      iconEl.className = 'activity-icon';
      iconEl.style.width = '36px';
      iconEl.style.height = '36px';
      iconEl.style.borderRadius = '50%';
      iconEl.style.background = 'var(--primary-light)';
      iconEl.style.display = 'flex';
      iconEl.style.alignItems = 'center';
      iconEl.style.justifyContent = 'center';
      iconEl.style.color = 'white';
      iconEl.innerHTML = `<i class="fas ${activity.icon}"></i>`;
      
      const detailsEl = document.createElement('div');
      detailsEl.style.flex = '1';
      
      const titleEl = document.createElement('div');
      titleEl.style.fontWeight = '600';
      titleEl.textContent = activity.type === 'sermon' ? `Sermon: ${activity.title}` :
                            activity.type === 'event' ? `Event: ${activity.title}` :
                            activity.type === 'media' ? `Media: ${activity.title}` :
                            activity.title;
      
      const dateEl = document.createElement('div');
      dateEl.style.fontSize = '0.85rem';
      dateEl.style.color = 'var(--text-light)';
      dateEl.textContent = new Date(activity.created_at).toLocaleString();
      
      detailsEl.appendChild(titleEl);
      detailsEl.appendChild(dateEl);
      
      activityEl.appendChild(iconEl);
      activityEl.appendChild(detailsEl);
      activitiesContainer.appendChild(activityEl);
    });
  } catch (error) {
    showToast(`Error loading activities: ${error.message}`, 'error');
  }
}

// Load sermons
async function loadSermons() {
  try {
    const { data: sermons, error } = await supabase
      .from('sermons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const tableBody = document.getElementById('sermonsTableBody');
    tableBody.innerHTML = '';
    
    if (sermons.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-light);">No sermons found</td></tr>';
      return;
    }
    
    sermons.forEach(sermon => {
      const row = document.createElement('tr');
      
      const titleCell = document.createElement('td');
      titleCell.textContent = sermon.title;
      
      const preacherCell = document.createElement('td');
      preacherCell.textContent = sermon.preacher;
      
      const dateCell = document.createElement('td');
      dateCell.textContent = new Date(sermon.date).toLocaleDateString();
      
      const actionsCell = document.createElement('td');
      actionsCell.className = 'action-buttons';
      
      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-small btn-view';
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.onclick = () => viewSermon(sermon);
      
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-small btn-edit';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.onclick = () => editSermon(sermon);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-small btn-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = () => deleteSermon(sermon.id);
      
      actionsCell.appendChild(viewBtn);
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(titleCell);
      row.appendChild(preacherCell);
      row.appendChild(dateCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    showToast(`Error loading sermons: ${error.message}`, 'error');
  }
}

// Load fellowships
async function loadFellowships() {
  try {
    const { data: fellowships, error } = await supabase
      .from('fellowships')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const tableBody = document.getElementById('fellowshipsTableBody');
    tableBody.innerHTML = '';
    
    if (fellowships.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">No fellowships found</td></tr>';
      return;
    }
    
    fellowships.forEach(fellowship => {
      const row = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = fellowship.name;
      
      const dayCell = document.createElement('td');
      dayCell.textContent = fellowship.day;
      
      const timeCell = document.createElement('td');
      timeCell.textContent = fellowship.time;
      
      const locationCell = document.createElement('td');
      locationCell.textContent = fellowship.location;
      
      const actionsCell = document.createElement('td');
      actionsCell.className = 'action-buttons';
      
      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-small btn-view';
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.onclick = () => viewFellowship(fellowship);
      
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-small btn-edit';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.onclick = () => editFellowship(fellowship);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-small btn-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = () => deleteFellowship(fellowship.id);
      
      actionsCell.appendChild(viewBtn);
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(nameCell);
      row.appendChild(dayCell);
      row.appendChild(timeCell);
      row.appendChild(locationCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    showToast(`Error loading fellowships: ${error.message}`, 'error');
  }
}

// Load events
async function loadEvents() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    const tableBody = document.getElementById('eventsTableBody');
    tableBody.innerHTML = '';
    
    if (events.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">No events found</td></tr>';
      return;
    }
    
    events.forEach(event => {
      const row = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = event.name;
      
      const dateCell = document.createElement('td');
      dateCell.textContent = new Date(event.date).toLocaleDateString();
      
      const timeCell = document.createElement('td');
      timeCell.textContent = `${event.start_time}${event.end_time ? ' - ' + event.end_time : ''}`;
      
      const typeCell = document.createElement('td');
      typeCell.textContent = event.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const actionsCell = document.createElement('td');
      actionsCell.className = 'action-buttons';
      
      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-small btn-view';
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.onclick = () => viewEvent(event);
      
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-small btn-edit';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.onclick = () => editEvent(event);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-small btn-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = () => deleteEvent(event.id);
      
      actionsCell.appendChild(viewBtn);
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(nameCell);
      row.appendChild(dateCell);
      row.appendChild(timeCell);
      row.appendChild(typeCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    showToast(`Error loading events: ${error.message}`, 'error');
  }
}

// Load media
async function loadMedia() {
  try {
    const { data: media, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const tableBody = document.getElementById('mediaTableBody');
    tableBody.innerHTML = '';
    
    if (media.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-light);">No media files found</td></tr>';
      return;
    }
    
    media.forEach(item => {
      const row = document.createElement('tr');
      
      const titleCell = document.createElement('td');
      titleCell.textContent = item.title;
      
      const categoryCell = document.createElement('td');
      categoryCell.textContent = item.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const typeCell = document.createElement('td');
      typeCell.innerHTML = `<i class="fas fa-${item.type === 'image' ? 'image' : 'video'}"></i> ${item.type}`;
      
      const actionsCell = document.createElement('td');
      actionsCell.className = 'action-buttons';
      
      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-small btn-view';
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.onclick = () => viewMedia(item);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-small btn-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = () => deleteMedia(item.id);
      
      actionsCell.appendChild(viewBtn);
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(titleCell);
      row.appendChild(categoryCell);
      row.appendChild(typeCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    showToast(`Error loading media: ${error.message}`, 'error');
  }
}

// Load attendance
async function loadAttendance() {
  try {
    const { data: attendance, error } = await supabase
      .from('attendance')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    const tableBody = document.getElementById('attendanceTableBody');
    tableBody.innerHTML = '';
    
    if (attendance.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: var(--text-light);">No attendance records found</td></tr>';
      return;
    }
    
    attendance.forEach(record => {
      const row = document.createElement('tr');
      
      const dateCell = document.createElement('td');
      dateCell.textContent = new Date(record.date).toLocaleDateString();
      
      const serviceCell = document.createElement('td');
      serviceCell.textContent = record.service_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const menCell = document.createElement('td');
      menCell.textContent = record.men || 0;
      
      const womenCell = document.createElement('td');
      womenCell.textContent = record.women || 0;
      
      const youthCell = document.createElement('td');
      youthCell.textContent = record.youth || 0;
      
      const childrenCell = document.createElement('td');
      childrenCell.textContent = record.children || 0;
      
      const visitorsCell = document.createElement('td');
      visitorsCell.textContent = record.visitors || 0;
      
      const totalCell = document.createElement('td');
      const total = (record.men || 0) + (record.women || 0) + (record.youth || 0) + 
                   (record.children || 0) + (record.visitors || 0);
      totalCell.textContent = total;
      
      const actionsCell = document.createElement('td');
      actionsCell.className = 'action-buttons';
      
      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-small btn-view';
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.onclick = () => viewAttendance(record);
      
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-small btn-edit';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.onclick = () => editAttendance(record);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-small btn-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = () => deleteAttendance(record.id);
      
      actionsCell.appendChild(viewBtn);
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(dateCell);
      row.appendChild(serviceCell);
      row.appendChild(menCell);
      row.appendChild(womenCell);
      row.appendChild(youthCell);
      row.appendChild(childrenCell);
      row.appendChild(visitorsCell);
      row.appendChild(totalCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    showToast(`Error loading attendance: ${error.message}`, 'error');
  }
}

// Load youth
async function loadYouth() {
  try {
    const { data: youth, error } = await supabase
      .from('youth')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    const tableBody = document.getElementById('youthTableBody');
    tableBody.innerHTML = '';
    
    if (youth.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-light);">No youth members found</td></tr>';
      return;
    }
    
    youth.forEach(member => {
      const row = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = member.name;
      
      const ageCell = document.createElement('td');
      ageCell.textContent = member.age;
      
      const genderCell = document.createElement('td');
      genderCell.textContent = member.gender.charAt(0).toUpperCase() + member.gender.slice(1);
      
      const phoneCell = document.createElement('td');
      phoneCell.textContent = member.phone || 'N/A';
      
      const schoolCell = document.createElement('td');
      schoolCell.textContent = member.school || 'N/A';
      
      const actionsCell = document.createElement('td');
      actionsCell.className = 'action-buttons';
      
      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-small btn-view';
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.onclick = () => viewYouth(member);
      
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-small btn-edit';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.onclick = () => editYouth(member);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-small btn-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = () => deleteYouth(member.id);
      
      actionsCell.appendChild(viewBtn);
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(nameCell);
      row.appendChild(ageCell);
      row.appendChild(genderCell);
      row.appendChild(phoneCell);
      row.appendChild(schoolCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    showToast(`Error loading youth: ${error.message}`, 'error');
  }
}

// Load elders
async function loadElders() {
  try {
    const { data: elders, error } = await supabase
      .from('elders')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    const tableBody = document.getElementById('eldersTableBody');
    tableBody.innerHTML = '';
    
    if (elders.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">No elders found</td></tr>';
      return;
    }
    
    elders.forEach(elder => {
      const row = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = elder.name;
      
      const positionCell = document.createElement('td');
      positionCell.textContent = elder.position;
      
      const phoneCell = document.createElement('td');
      phoneCell.textContent = elder.phone || 'N/A';
      
      const emailCell = document.createElement('td');
      emailCell.textContent = elder.email || 'N/A';
      
      const actionsCell = document.createElement('td');
      actionsCell.className = 'action-buttons';
      
      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-small btn-view';
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.onclick = () => viewElder(elder);
      
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-small btn-edit';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.onclick = () => editElder(elder);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-small btn-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = () => deleteElder(elder.id);
      
      actionsCell.appendChild(viewBtn);
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(nameCell);
      row.appendChild(positionCell);
      row.appendChild(phoneCell);
      row.appendChild(emailCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    showToast(`Error loading elders: ${error.message}`, 'error');
  }
}

// Load songs
async function loadSongs() {
  try {
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .order('title', { ascending: true });
    
    if (error) throw error;
    
    const tableBody = document.getElementById('songsTableBody');
    tableBody.innerHTML = '';
    
    if (songs.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">No songs found</td></tr>';
      return;
    }
    
    songs.forEach(song => {
      const row = document.createElement('tr');
      
      const titleCell = document.createElement('td');
      titleCell.textContent = song.title;
      
      const authorCell = document.createElement('td');
      authorCell.textContent = song.author || 'N/A';
      
      const categoryCell = document.createElement('td');
      categoryCell.textContent = song.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const keyCell = document.createElement('td');
      keyCell.textContent = song.key || 'N/A';
      
      const actionsCell = document.createElement('td');
      actionsCell.className = 'action-buttons';
      
      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn-small btn-view';
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.onclick = () => viewSong(song);
      
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-small btn-edit';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.onclick = () => editSong(song);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-small btn-delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = () => deleteSong(song.id);
      
      actionsCell.appendChild(viewBtn);
      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(titleCell);
      row.appendChild(authorCell);
      row.appendChild(categoryCell);
      row.appendChild(keyCell);
      row.appendChild(actionsCell);
      
      tableBody.appendChild(row);
    });
  } catch (error) {
    showToast(`Error loading songs: ${error.message}`, 'error');
  }
}

// Render attendance charts
function renderAttendanceCharts() {
  // Get attendance data for the last 12 weeks
  const today = new Date();
  const twelveWeeksAgo = new Date(today);
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
  
  supabase
    .from('attendance')
    .select('date, men, women, youth, children, visitors')
    .gte('date', twelveWeeksAgo.toISOString().split('T')[0])
    .order('date', { ascending: true })
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching attendance data:', error);
        return;
      }
      
      // Group data by week
      const weeklyData = {};
      data.forEach(record => {
        const date = new Date(record.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            labels: [],
            men: [],
            women: [],
            youth: [],
            children: [],
            visitors: [],
            total: []
          };
        }
        
        weeklyData[weekKey].labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        weeklyData[weekKey].men.push(record.men || 0);
        weeklyData[weekKey].women.push(record.women || 0);
        weeklyData[weekKey].youth.push(record.youth || 0);
        weeklyData[weekKey].children.push(record.children || 0);
        weeklyData[weekKey].visitors.push(record.visitors || 0);
        weeklyData[weekKey].total.push(
          (record.men || 0) + (record.women || 0) + (record.youth || 0) + 
          (record.children || 0) + (record.visitors || 0)
        );
      });
      
      // Calculate weekly averages
      const weekLabels = [];
      const avgMen = [];
      const avgWomen = [];
      const avgYouth = [];
      const avgChildren = [];
      const avgVisitors = [];
      const avgTotal = [];
      
      Object.keys(weeklyData).sort().forEach(weekKey => {
        const week = weeklyData[weekKey];
        const weekStart = new Date(weekKey);
        weekLabels.push(`Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
        
        avgMen.push(week.men.reduce((a, b) => a + b, 0) / week.men.length);
        avgWomen.push(week.women.reduce((a, b) => a + b, 0) / week.women.length);
        avgYouth.push(week.youth.reduce((a, b) => a + b, 0) / week.youth.length);
        avgChildren.push(week.children.reduce((a, b) => a + b, 0) / week.children.length);
        avgVisitors.push(week.visitors.reduce((a, b) => a + b, 0) / week.visitors.length);
        avgTotal.push(week.total.reduce((a, b) => a + b, 0) / week.total.length);
      });
      
      // Render trend chart
      const trendCtx = document.getElementById('attendanceTrendChart');
      if (trendCtx) {
        new Chart(trendCtx, {
          type: 'line',
          data: {
            labels: weekLabels,
            datasets: [
              {
                label: 'Average Total Attendance',
                data: avgTotal,
                borderColor: '#4a6de5',
                backgroundColor: 'rgba(74, 109, 229, 0.1)',
                tension: 0.3,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Weekly Attendance Trend (Last 12 Weeks)'
              },
              legend: {
                position: 'bottom'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Average Attendance'
                }
              }
            }
          }
        });
      }
      
      // Render demographics chart
      const demographicsCtx = document.getElementById('attendanceDemographicsChart');
      if (demographicsCtx) {
        new Chart(demographicsCtx, {
          type: 'bar',
          data: {
            labels: weekLabels.slice(-4), // Last 4 weeks
            datasets: [
              {
                label: 'Men',
                data: avgMen.slice(-4),
                backgroundColor: '#4a6de5'
              },
              {
                label: 'Women',
                data: avgWomen.slice(-4),
                backgroundColor: '#f85a5a'
              },
              {
                label: 'Youth',
                data: avgYouth.slice(-4),
                backgroundColor: '#4cd3c2'
              },
              {
                label: 'Children',
                data: avgChildren.slice(-4),
                backgroundColor: '#f57c00'
              },
              {
                label: 'Visitors',
                data: avgVisitors.slice(-4),
                backgroundColor: '#0288d1'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Attendance Demographics (Last 4 Weeks)'
              },
              legend: {
                position: 'bottom'
              }
            },
            scales: {
              x: {
                stacked: true
              },
              y: {
                stacked: true,
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of People'
                }
              }
            }
          }
        });
      }
    });
}

// View functions
function viewSermon(sermon) {
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--primary-dark);">${sermon.title}</h3>
    <p><strong>Preacher:</strong> ${sermon.preacher}</p>
    <p><strong>Date:</strong> ${new Date(sermon.date).toLocaleDateString()}</p>
    <p><strong>Description:</strong> ${sermon.description}</p>
    ${sermon.media_url ? `<p><strong>Media:</strong> <a href="${sermon.media_url}" target="_blank">View Media</a></p>` : ''}
  `;
  document.getElementById('viewModal').style.display = 'flex';
}

function viewFellowship(fellowship) {
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--primary-dark);">${fellowship.name}</h3>
    <p><strong>Meeting Day:</strong> ${fellowship.day}</p>
    <p><strong>Time:</strong> ${fellowship.time}</p>
    <p><strong>Location:</strong> ${fellowship.location}</p>
    <p><strong>Leader:</strong> ${fellowship.leader}</p>
    <p><strong>Description:</strong> ${fellowship.description}</p>
  `;
  document.getElementById('viewModal').style.display = 'flex';
}

function viewEvent(event) {
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--primary-dark);">${event.name}</h3>
    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
    <p><strong>Time:</strong> ${event.start_time}${event.end_time ? ' - ' + event.end_time : ''}</p>
    <p><strong>Type:</strong> ${event.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
    <p><strong>Description:</strong> ${event.description}</p>
  `;
  document.getElementById('viewModal').style.display = 'flex';
}

function viewMedia(mediaItem) {
  const modalContent = document.getElementById('modalContent');
  const mediaElement = mediaItem.type === 'image' 
    ? `<img src="${mediaItem.file_url}" style="max-width: 100%; border-radius: 8px;">`
    : `<video src="${mediaItem.file_url}" controls style="max-width: 100%; border-radius: 8px;"></video>`;
  
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--primary-dark);">${mediaItem.title}</h3>
    <p><strong>Category:</strong> ${mediaItem.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
    <div style="margin: 1rem 0;">
      ${mediaElement}
    </div>
    <p><a href="${mediaItem.file_url}" target="_blank" style="color: var(--primary);">Open in new tab</a></p>
  `;
  document.getElementById('viewModal').style.display = 'flex';
}

function viewAttendance(record) {
  const modalContent = document.getElementById('modalContent');
  const total = (record.men || 0) + (record.women || 0) + (record.youth || 0) + 
               (record.children || 0) + (record.visitors || 0);
  
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--primary-dark);">Attendance Record</h3>
    <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
    <p><strong>Service Type:</strong> ${record.service_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
    <div style="margin: 1rem 0;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span>Men:</span>
        <span>${record.men || 0}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span>Women:</span>
        <span>${record.women || 0}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span>Youth:</span>
        <span>${record.youth || 0}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span>Children:</span>
        <span>${record.children || 0}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span>Visitors:</span>
        <span>${record.visitors || 0}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 1rem; padding-top: 0.5rem; border-top: 1px solid #eee;">
        <span>Total:</span>
        <span>${total}</span>
      </div>
    </div>
  `;
  document.getElementById('viewModal').style.display = 'flex';
}

function viewYouth(member) {
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--primary-dark);">${member.name}</h3>
    <p><strong>Age:</strong> ${member.age}</p>
    <p><strong>Gender:</strong> ${member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}</p>
    <p><strong>Phone:</strong> ${member.phone || 'N/A'}</p>
    <p><strong>School/College/Work:</strong> ${member.school || 'N/A'}</p>
    <p><strong>Interests/Talents:</strong> ${member.interests || 'N/A'}</p>
  `;
  document.getElementById('viewModal').style.display = 'flex';
}

function viewElder(elder) {
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--primary-dark);">${elder.name}</h3>
    <p><strong>Position:</strong> ${elder.position}</p>
    <p><strong>Phone:</strong> ${elder.phone || 'N/A'}</p>
    <p><strong>Email:</strong> ${elder.email || 'N/A'}</p>
    <p><strong>Responsibilities:</strong> ${elder.responsibilities || 'N/A'}</p>
    <p><strong>Bio:</strong> ${elder.bio || 'N/A'}</p>
  `;
  document.getElementById('viewModal').style.display = 'flex';
}

function viewSong(song) {
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 1rem; color: var(--primary-dark);">${song.title}</h3>
    <p><strong>Author/Artist:</strong> ${song.author || 'N/A'}</p>
    <p><strong>Category:</strong> ${song.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
    <p><strong>Key:</strong> ${song.key || 'N/A'}</p>
    <div style="margin-top: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 8px; white-space: pre-line;">
      ${song.lyrics}
    </div>
  `;
  document.getElementById('viewModal').style.display = 'flex';
}

// Edit functions
function editSermon(sermon) {
  // Switch to sermon form tab
  document.querySelector('[data-content="sermon-form"]').click();
  
  // Populate form with sermon data
  document.getElementById('sermonTitle').value = sermon.title;
  document.getElementById('sermonPreacher').value = sermon.preacher;
  document.getElementById('sermonDate').value = sermon.date;
  document.getElementById('sermonDesc').value = sermon.description;
  document.getElementById('sermonMedia').value = sermon.media_url || '';
  
  // Change button text
  const btnText = document.getElementById('sermonBtnText');
  btnText.textContent = 'Update Sermon';
  
  // Change button onclick to update function
  document.getElementById('sermonBtn').onclick = () => updateSermon(sermon.id);
  
  showToast('Sermon loaded for editing', 'info');
}

function editFellowship(fellowship) {
  // Switch to fellowship form tab
  document.querySelector('[data-content="fellowship-form"]').click();
  
  // Populate form with fellowship data
  document.getElementById('fellowshipName').value = fellowship.name;
  document.getElementById('fellowshipDay').value = fellowship.day;
  document.getElementById('fellowshipTime').value = fellowship.time;
  document.getElementById('fellowshipLocation').value = fellowship.location;
  document.getElementById('fellowshipLeader').value = fellowship.leader;
  document.getElementById('fellowshipDesc').value = fellowship.description;
  
  // Change button text
  const btnText = document.getElementById('fellowshipBtnText');
  btnText.textContent = 'Update Fellowship';
  
  // Change button onclick to update function
  document.getElementById('fellowshipBtn').onclick = () => updateFellowship(fellowship.id);
  
  showToast('Fellowship loaded for editing', 'info');
}

function editEvent(event) {
  // Switch to event form tab
  document.querySelector('[data-content="event-form"]').click();
  
  // Populate form with event data
  document.getElementById('eventName').value = event.name;
  document.getElementById('eventDate').value = event.date;
  document.getElementById('eventStartTime').value = event.start_time;
  document.getElementById('eventEndTime').value = event.end_time || '';
  document.getElementById('eventDesc').value = event.description;
  document.getElementById('eventType').value = event.type;
  
  // Change button text
  const btnText = document.getElementById('eventBtnText');
  btnText.textContent = 'Update Event';
  
  // Change button onclick to update function
  document.getElementById('eventBtn').onclick = () => updateEvent(event.id);
  
  showToast('Event loaded for editing', 'info');
}

function editAttendance(record) {
  // Switch to attendance form tab
  document.querySelector('[data-content="attendance-form"]').click();
  
  // Populate form with attendance data
  document.getElementById('attendanceDate').value = record.date;
  document.getElementById('serviceType').value = record.service_type;
  document.getElementById('menCount').value = record.men || 0;
  document.getElementById('womenCount').value = record.women || 0;
  document.getElementById('youthCount').value = record.youth || 0;
  document.getElementById('childrenCount').value = record.children || 0;
  document.getElementById('visitorsCount').value = record.visitors || 0;
  
  // Change button text
  const btnText = document.getElementById('attendanceBtnText');
  btnText.textContent = 'Update Attendance';
  
  // Change button onclick to update function
  document.getElementById('attendanceBtn').onclick = () => updateAttendance(record.id);
  
  showToast('Attendance record loaded for editing', 'info');
}

function editYouth(member) {
  // Switch to youth form tab
  document.querySelector('[data-content="youth-form"]').click();
  
  // Populate form with youth data
  document.getElementById('youthName').value = member.name;
  document.getElementById('youthAge').value = member.age;
  document.getElementById('youthGender').value = member.gender;
  document.getElementById('youthPhone').value = member.phone || '';
  document.getElementById('youthSchool').value = member.school || '';
  document.getElementById('youthInterests').value = member.interests || '';
  
  // Change button text
  const btnText = document.getElementById('youthBtnText');
  btnText.textContent = 'Update Youth Member';
  
  // Change button onclick to update function
  document.getElementById('youthBtn').onclick = () => updateYouth(member.id);
  
  showToast('Youth member loaded for editing', 'info');
}

function editElder(elder) {
  // Switch to elder form tab
  document.querySelector('[data-content="elder-form"]').click();
  
  // Populate form with elder data
  document.getElementById('elderName').value = elder.name;
  document.getElementById('elderPosition').value = elder.position;
  document.getElementById('elderPhone').value = elder.phone || '';
  document.getElementById('elderEmail').value = elder.email || '';
  document.getElementById('elderResponsibilities').value = elder.responsibilities || '';
  document.getElementById('elderBio').value = elder.bio || '';
  
  // Change button text
  const btnText = document.getElementById('elderBtnText');
  btnText.textContent = 'Update Elder';
  
  // Change button onclick to update function
  document.getElementById('elderBtn').onclick = () => updateElder(elder.id);
  
  showToast('Elder loaded for editing', 'info');
}

function editSong(song) {
  // Switch to song form tab
  document.querySelector('[data-content="song-form"]').click();
  
  // Populate form with song data
  document.getElementById('songTitle').value = song.title;
  document.getElementById('songAuthor').value = song.author || '';
  document.getElementById('songCategory').value = song.category;
  document.getElementById('songKey').value = song.key || '';
  document.getElementById('songLyrics').value = song.lyrics;
  
  // Change button text
  const btnText = document.getElementById('songBtnText');
  btnText.textContent = 'Update Song';
  
  // Change button onclick to update function
  document.getElementById('songBtn').onclick = () => updateSong(song.id);
  
  showToast('Song loaded for editing', 'info');
}

// Update functions
async function updateSermon(id) {
  const title = document.getElementById('sermonTitle').value.trim();
  const preacher = document.getElementById('sermonPreacher').value.trim();
  const date = document.getElementById('sermonDate').value;
  const desc = document.getElementById('sermonDesc').value.trim();
  const mediaUrl = document.getElementById('sermonMedia').value.trim();
  
  const btnText = document.getElementById('sermonBtnText');
  const btnSpinner = document.getElementById('sermonBtnSpinner');
  
  if (!title || !preacher || !date || !desc) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Update sermon in Supabase
    const { data, error } = await supabase
      .from('sermons')
      .update({
        title, 
        preacher, 
        date, 
        description: desc, 
        media_url: mediaUrl || null 
      })
      .eq('id', id);
      
    if (error) throw error;
    
    showToast(`Sermon "${title}" updated successfully`, 'success');
    document.getElementById('sermonForm').reset();
    
    // Reset button
    btnText.textContent = 'Post Sermon';
    document.getElementById('sermonBtn').onclick = postSermon;
    
    // Reload sermons
    loadSermons();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

async function updateFellowship(id) {
  const name = document.getElementById('fellowshipName').value.trim();
  const day = document.getElementById('fellowshipDay').value;
  const time = document.getElementById('fellowshipTime').value;
  const location = document.getElementById('fellowshipLocation').value.trim();
  const leader = document.getElementById('fellowshipLeader').value.trim();
  const desc = document.getElementById('fellowshipDesc').value.trim();
  
  const btnText = document.getElementById('fellowshipBtnText');
  const btnSpinner = document.getElementById('fellowshipBtnSpinner');
  
  if (!name || !day || !time || !location || !leader || !desc) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Update fellowship in Supabase
    const { data, error } = await supabase
      .from('fellowships')
      .update({
        name, 
        day, 
        time, 
        location, 
        leader, 
        description: desc 
      })
      .eq('id', id);
      
    if (error) throw error;
    
    showToast(`${name} fellowship updated successfully`, 'success');
    document.getElementById('fellowshipForm').reset();
    
    // Reset button
    btnText.textContent = 'Post Fellowship';
    document.getElementById('fellowshipBtn').onclick = postFellowship;
    
    // Reload fellowships
    loadFellowships();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

async function updateEvent(id) {
  const name = document.getElementById('eventName').value.trim();
  const date = document.getElementById('eventDate').value;
  const startTime = document.getElementById('eventStartTime').value;
  const endTime = document.getElementById('eventEndTime').value;
  const desc = document.getElementById('eventDesc').value.trim();
  const type = document.getElementById('eventType').value;
  
  const btnText = document.getElementById('eventBtnText');
  const btnSpinner = document.getElementById('eventBtnSpinner');
  
  if (!name || !date || !startTime || !desc || !type) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Update event in Supabase
    const { data, error } = await supabase
      .from('events')
      .update({
        name, 
        date, 
        start_time: startTime, 
        end_time: endTime || null, 
        description: desc,
        type
      })
      .eq('id', id);
      
    if (error) throw error;
    
    showToast(`Event "${name}" updated successfully`, 'success');
    document.getElementById('eventForm').reset();
    document.getElementById('eventPreview').innerHTML = '';
    
    // Reset button
    btnText.textContent = 'Post Event';
    document.getElementById('eventBtn').onclick = postEvent;
    
    // Reload events
    loadEvents();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

async function updateAttendance(id) {
  const date = document.getElementById('attendanceDate').value;
  const serviceType = document.getElementById('serviceType').value;
  const men = parseInt(document.getElementById('menCount').value) || 0;
  const women = parseInt(document.getElementById('womenCount').value) || 0;
  const youth = parseInt(document.getElementById('youthCount').value) || 0;
  const children = parseInt(document.getElementById('childrenCount').value) || 0;
  const visitors = parseInt(document.getElementById('visitorsCount').value) || 0;
  
  const btnText = document.getElementById('attendanceBtnText');
  const btnSpinner = document.getElementById('attendanceBtnSpinner');
  
  if (!date || !serviceType) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Update attendance in Supabase
    const { data, error } = await supabase
      .from('attendance')
      .update({
        date, 
        service_type: serviceType, 
        men, 
        women, 
        youth, 
        children, 
        visitors
      })
      .eq('id', id);
      
    if (error) throw error;
    
    showToast('Attendance record updated successfully', 'success');
    document.getElementById('attendanceForm').reset();
    
    // Reset button
    btnText.textContent = 'Record Attendance';
    document.getElementById('attendanceBtn').onclick = recordAttendance;
    
    // Reload attendance
    loadAttendance();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

async function updateYouth(id) {
  const name = document.getElementById('youthName').value.trim();
  const age = parseInt(document.getElementById('youthAge').value);
  const gender = document.getElementById('youthGender').value;
  const phone = document.getElementById('youthPhone').value.trim();
  const school = document.getElementById('youthSchool').value.trim();
  const interests = document.getElementById('youthInterests').value.trim();
  
  const btnText = document.getElementById('youthBtnText');
  const btnSpinner = document.getElementById('youthBtnSpinner');
  
  if (!name || !age || !gender) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Update youth in Supabase
    const { data, error } = await supabase
      .from('youth')
      .update({
        name, 
        age, 
        gender, 
        phone: phone || null, 
        school: school || null, 
        interests: interests || null
      })
      .eq('id', id);
      
    if (error) throw error;
    
    showToast(`Youth member "${name}" updated successfully`, 'success');
    document.getElementById('youthForm').reset();
    
    // Reset button
    btnText.textContent = 'Add Youth Member';
    document.getElementById('youthBtn').onclick = addYouth;
    
    // Reload youth
    loadYouth();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

async function updateElder(id) {
  const name = document.getElementById('elderName').value.trim();
  const position = document.getElementById('elderPosition').value.trim();
  const phone = document.getElementById('elderPhone').value.trim();
  const email = document.getElementById('elderEmail').value.trim();
  const responsibilities = document.getElementById('elderResponsibilities').value.trim();
  const bio = document.getElementById('elderBio').value.trim();
  
  const btnText = document.getElementById('elderBtnText');
  const btnSpinner = document.getElementById('elderBtnSpinner');
  
  if (!name || !position) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Update elder in Supabase
    const { data, error } = await supabase
      .from('elders')
      .update({
        name, 
        position, 
        phone: phone || null, 
        email: email || null, 
        responsibilities: responsibilities || null,
        bio: bio || null
      })
      .eq('id', id);
      
    if (error) throw error;
    
    showToast(`Elder "${name}" updated successfully`, 'success');
    document.getElementById('elderForm').reset();
    
    // Reset button
    btnText.textContent = 'Add Elder';
    document.getElementById('elderBtn').onclick = addElder;
    
    // Reload elders
    loadElders();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

async function updateSong(id) {
  const title = document.getElementById('songTitle').value.trim();
  const author = document.getElementById('songAuthor').value.trim();
  const category = document.getElementById('songCategory').value;
  const key = document.getElementById('songKey').value.trim();
  const lyrics = document.getElementById('songLyrics').value.trim();
  
  const btnText = document.getElementById('songBtnText');
  const btnSpinner = document.getElementById('songBtnSpinner');
  
  if (!title || !category || !lyrics) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Update song in Supabase
    const { data, error } = await supabase
      .from('songs')
      .update({
        title, 
        author: author || null, 
        category, 
        key: key || null,
        lyrics
      })
      .eq('id', id);
      
    if (error) throw error;
    
    showToast(`Song "${title}" updated successfully`, 'success');
    document.getElementById('songForm').reset();
    
    // Reset button
    btnText.textContent = 'Add Song';
    document.getElementById('songBtn').onclick = addSong;
    
    // Reload songs
    loadSongs();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Delete functions
async function deleteSermon(id) {
  if (!confirm('Are you sure you want to delete this sermon?')) return;
  
  try {
    const { error } = await supabase
      .from('sermons')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    showToast('Sermon deleted successfully', 'success');
    loadSermons();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}

async function deleteFellowship(id) {
  if (!confirm('Are you sure you want to delete this fellowship?')) return;
  
  try {
    const { error } = await supabase
      .from('fellowships')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    showToast('Fellowship deleted successfully', 'success');
    loadFellowships();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}

async function deleteEvent(id) {
  if (!confirm('Are you sure you want to delete this event?')) return;
  
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    showToast('Event deleted successfully', 'success');
    loadEvents();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}

async function deleteMedia(id) {
  if (!confirm('Are you sure you want to delete this media file?')) return;
  
  try {
    // First, get the media file URL to delete from storage
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('file_url')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Extract filename from URL
    const url = new URL(media.file_url);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([`uploads/${fileName}`]);
      
    if (storageError) {
      console.error('Storage delete error:', storageError);
      // Continue with database deletion even if storage deletion fails
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
      
    if (deleteError) throw deleteError;
    
    showToast('Media file deleted successfully', 'success');
    loadMedia();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}

async function deleteAttendance(id) {
  if (!confirm('Are you sure you want to delete this attendance record?')) return;
  
  try {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    showToast('Attendance record deleted successfully', 'success');
    loadAttendance();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}

async function deleteYouth(id) {
  if (!confirm('Are you sure you want to delete this youth member?')) return;
  
  try {
    const { error } = await supabase
      .from('youth')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    showToast('Youth member deleted successfully', 'success');
    loadYouth();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}

async function deleteElder(id) {
  if (!confirm('Are you sure you want to delete this elder?')) return;
  
  try {
    const { error } = await supabase
      .from('elders')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    showToast('Elder deleted successfully', 'success');
    loadElders();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}

async function deleteSong(id) {
  if (!confirm('Are you sure you want to delete this song?')) return;
  
  try {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    showToast('Song deleted successfully', 'success');
    loadSongs();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  }
}

// Post sermon
async function postSermon() {
  const title = document.getElementById('sermonTitle').value.trim();
  const preacher = document.getElementById('sermonPreacher').value.trim();
  const date = document.getElementById('sermonDate').value;
  const desc = document.getElementById('sermonDesc').value.trim();
  const mediaUrl = document.getElementById('sermonMedia').value.trim();
  
  const btnText = document.getElementById('sermonBtnText');
  const btnSpinner = document.getElementById('sermonBtnSpinner');
  
  if (!title || !preacher || !date || !desc) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Insert sermon into Supabase
    const { data, error } = await supabase
      .from('sermons')
      .insert([
        { 
          title, 
          preacher, 
          date, 
          description: desc, 
          media_url: mediaUrl || null,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) throw error;
    
    showToast(`Sermon "${title}" posted successfully`, 'success');
    document.getElementById('sermonForm').reset();
    
    // Reset button if it was in update mode
    if (btnText.textContent === 'Update Sermon') {
      btnText.textContent = 'Post Sermon';
      document.getElementById('sermonBtn').onclick = postSermon;
    }
    
    // Reload sermons
    loadSermons();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Post fellowship
async function postFellowship() {
  const name = document.getElementById('fellowshipName').value.trim();
  const day = document.getElementById('fellowshipDay').value;
  const time = document.getElementById('fellowshipTime').value;
  const location = document.getElementById('fellowshipLocation').value.trim();
  const leader = document.getElementById('fellowshipLeader').value.trim();
  const desc = document.getElementById('fellowshipDesc').value.trim();
  
  const btnText = document.getElementById('fellowshipBtnText');
  const btnSpinner = document.getElementById('fellowshipBtnSpinner');
  
  if (!name || !day || !time || !location || !leader || !desc) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Insert fellowship into Supabase
    const { data, error } = await supabase
      .from('fellowships')
      .insert([
        { 
          name, 
          day, 
          time, 
          location, 
          leader, 
          description: desc,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) throw error;
    
    showToast(`${name} fellowship added successfully`, 'success');
    document.getElementById('fellowshipForm').reset();
    
    // Reset button if it was in update mode
    if (btnText.textContent === 'Update Fellowship') {
      btnText.textContent = 'Post Fellowship';
      document.getElementById('fellowshipBtn').onclick = postFellowship;
    }
    
    // Reload fellowships
    loadFellowships();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Post event
async function postEvent() {
  const name = document.getElementById('eventName').value.trim();
  const date = document.getElementById('eventDate').value;
  const startTime = document.getElementById('eventStartTime').value;
  const endTime = document.getElementById('eventEndTime').value;
  const desc = document.getElementById('eventDesc').value.trim();
  const type = document.getElementById('eventType').value;
  const files = document.getElementById('eventMedia').files;
  
  const btnText = document.getElementById('eventBtnText');
  const btnSpinner = document.getElementById('eventBtnSpinner');
  
  if (!name || !date || !startTime || !desc || !type) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    let fileUrls = [];
    
    // If there are files, upload them to Supabase storage
    if (files.length > 0) {
      for (const file of files) {
        // Generate a unique filename
        const fileName = `${Date.now()}_${file.name}`;
        
        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(`events/${fileName}`, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(`events/${fileName}`);
          
        fileUrls.push(publicUrlData.publicUrl);
      }
    }
    
    // Insert event into Supabase
    const { data, error } = await supabase
      .from('events')
      .insert([
        { 
          name, 
          date, 
          start_time: startTime, 
          end_time: endTime || null, 
          description: desc,
          type,
          media_urls: fileUrls.length > 0 ? fileUrls : null,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) throw error;
    
    showToast(`Event "${name}" added successfully`, 'success');
    document.getElementById('eventForm').reset();
    document.getElementById('eventPreview').innerHTML = '';
    
    // Reset button if it was in update mode
    if (btnText.textContent === 'Update Event') {
      btnText.textContent = 'Post Event';
      document.getElementById('eventBtn').onclick = postEvent;
    }
    
    // Reload events
    loadEvents();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Upload media
async function uploadMedia() {
  const title = document.getElementById('mediaTitle').value.trim();
  const category = document.getElementById('mediaCategory').value;
  const files = document.getElementById('mediaFile').files;
  
  const btnText = document.getElementById('mediaBtnText');
  const btnSpinner = document.getElementById('mediaBtnSpinner');
  
  if (!title || !category || files.length === 0) {
    showToast('Please fill in all required fields and select files', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Process each file
    const mediaRecords = [];
    
    for (const file of files) {
      // Generate a unique filename
      const fileName = `${Date.now()}_${file.name}`;
      
      // Step 1: Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(`uploads/${fileName}`, file);
        
      if (uploadError) throw uploadError;
      
      // Step 2: Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(`uploads/${fileName}`);
        
      const publicUrl = publicUrlData.publicUrl;
      
      // Step 3: Save the URL in the media table
      mediaRecords.push({
        title,
        category,
        file_url: publicUrl,
        type: file.type.startsWith('image') ? 'image' : 'video'
        // Note: removed created_at as it has a default value in the database
      });
    }
    
    // Insert all media records into Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('media')
      .insert(mediaRecords);
      
    if (insertError) throw insertError;
    
    showToast(`${files.length} media item${files.length > 1 ? 's' : ''} uploaded successfully`, 'success');
    document.getElementById('mediaForm').reset();
    document.getElementById('mediaPreview').innerHTML = '';
    
    // Reload media
    loadMedia();
  } catch (error) {
    console.error('Error uploading media:', error);
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Record attendance
async function recordAttendance() {
  const date = document.getElementById('attendanceDate').value;
  const serviceType = document.getElementById('serviceType').value;
  const men = parseInt(document.getElementById('menCount').value) || 0;
  const women = parseInt(document.getElementById('womenCount').value) || 0;
  const youth = parseInt(document.getElementById('youthCount').value) || 0;
  const children = parseInt(document.getElementById('childrenCount').value) || 0;
  const visitors = parseInt(document.getElementById('visitorsCount').value) || 0;
  
  const btnText = document.getElementById('attendanceBtnText');
  const btnSpinner = document.getElementById('attendanceBtnSpinner');
  
  if (!date || !serviceType) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Insert attendance into Supabase
    const { data, error } = await supabase
      .from('attendance')
      .insert([
        { 
          date, 
          service_type: serviceType, 
          men, 
          women, 
          youth, 
          children, 
          visitors,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) throw error;
    
    const total = men + women + youth + children + visitors;
    showToast(`Attendance recorded successfully: ${total} people`, 'success');
    document.getElementById('attendanceForm').reset();
    
    // Reset button if it was in update mode
    if (btnText.textContent === 'Update Attendance') {
      btnText.textContent = 'Record Attendance';
      document.getElementById('attendanceBtn').onclick = recordAttendance;
    }
    
    // Reload attendance
    loadAttendance();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Add youth
async function addYouth() {
  const name = document.getElementById('youthName').value.trim();
  const age = parseInt(document.getElementById('youthAge').value);
  const gender = document.getElementById('youthGender').value;
  const phone = document.getElementById('youthPhone').value.trim();
  const school = document.getElementById('youthSchool').value.trim();
  const interests = document.getElementById('youthInterests').value.trim();
  
  const btnText = document.getElementById('youthBtnText');
  const btnSpinner = document.getElementById('youthBtnSpinner');
  
  if (!name || !age || !gender) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Insert youth into Supabase
    const { data, error } = await supabase
      .from('youth')
      .insert([
        { 
          name, 
          age, 
          gender, 
          phone: phone || null, 
          school: school || null, 
          interests: interests || null,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) throw error;
    
    showToast(`Youth member "${name}" added successfully`, 'success');
    document.getElementById('youthForm').reset();
    
    // Reset button if it was in update mode
    if (btnText.textContent === 'Update Youth Member') {
      btnText.textContent = 'Add Youth Member';
      document.getElementById('youthBtn').onclick = addYouth;
    }
    
    // Reload youth
    loadYouth();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Add elder
async function addElder() {
  const name = document.getElementById('elderName').value.trim();
  const position = document.getElementById('elderPosition').value.trim();
  const phone = document.getElementById('elderPhone').value.trim();
  const email = document.getElementById('elderEmail').value.trim();
  const responsibilities = document.getElementById('elderResponsibilities').value.trim();
  const bio = document.getElementById('elderBio').value.trim();
  
  const btnText = document.getElementById('elderBtnText');
  const btnSpinner = document.getElementById('elderBtnSpinner');
  
  if (!name || !position) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Insert elder into Supabase
    const { data, error } = await supabase
      .from('elders')
      .insert([
        { 
          name, 
          position, 
          phone: phone || null, 
          email: email || null, 
          responsibilities: responsibilities || null,
          bio: bio || null,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) throw error;
    
    showToast(`Elder "${name}" added successfully`, 'success');
    document.getElementById('elderForm').reset();
    
    // Reset button if it was in update mode
    if (btnText.textContent === 'Update Elder') {
      btnText.textContent = 'Add Elder';
      document.getElementById('elderBtn').onclick = addElder;
    }
    
    // Reload elders
    loadElders();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Add song
async function addSong() {
  const title = document.getElementById('songTitle').value.trim();
  const author = document.getElementById('songAuthor').value.trim();
  const category = document.getElementById('songCategory').value;
  const key = document.getElementById('songKey').value.trim();
  const lyrics = document.getElementById('songLyrics').value.trim();
  
  const btnText = document.getElementById('songBtnText');
  const btnSpinner = document.getElementById('songBtnSpinner');
  
  if (!title || !category || !lyrics) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Show loading state
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  
  try {
    // Insert song into Supabase
    const { data, error } = await supabase
      .from('songs')
      .insert([
        { 
          title, 
          author: author || null, 
          category, 
          key: key || null,
          lyrics,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) throw error;
    
    showToast(`Song "${title}" added successfully`, 'success');
    document.getElementById('songForm').reset();
    
    // Reset button if it was in update mode
    if (btnText.textContent === 'Update Song') {
      btnText.textContent = 'Add Song';
      document.getElementById('songBtn').onclick = addSong;
    }
    
    // Reload songs
    loadSongs();
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    // Reset button state
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

// Modal functions
function closeModal() {
  document.getElementById('viewModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('viewModal');
  if (event.target === modal) {
    closeModal();
  }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadDashboardData();
});
document.getElementById('loadStudentsBtn').addEventListener('click', loadStudents);

async function loadStudents() {
  try {
    const response = await fetch('/api/students');
    if (!response.ok) {
      throw new Error('Failed to load student data');
    }
    const data = await response.json();
    const tableBody = document.querySelector('#studentsTable tbody');
    tableBody.innerHTML = '';  // Clear the table before inserting new rows

    const fragment = document.createDocumentFragment();  // Using DocumentFragment to optimize DOM updates
    data.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.StudentID}</td>
        <td>${student.Name}</td>
        <td>${student.Gender}</td>
        <td>${student.Birthdate}</td>
        <td><button class="delete-btn" data-id="${student.StudentID}">Delete</button></td>
      `;
      fragment.appendChild(row);
    });
    tableBody.appendChild(fragment);

    // Attach delete event listeners
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        deleteStudent(event.target.dataset.id);
      });
    });
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

async function deleteStudent(studentID) {
  try {
    const response = await fetch(`/api/students/${studentID}`, { method: 'DELETE' });
    const data = await response.json();
    alert(data.message);
    loadStudents();  // Reload students after deletion
  } catch (error) {
    console.error('Error deleting student:', error);
  }
}

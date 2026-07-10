// =====================================
// Automated Attendance System
// =====================================

// Demo students (added only once)
if (!localStorage.getItem("students")) {
    const sampleStudents = [
        {
            name: "Dhilip P",
            roll: "101",
            class: "10",
            section: "A",
            gender: "Male",
            parent: "Parent 1",
            phone: "9876543210"
        },
        {
            name: "Rahul",
            roll: "102",
            class: "10",
            section: "A",
            gender: "Male",
            parent: "Parent 2",
            phone: "9876543211"
        },
        {
            name: "Priya",
            roll: "103",
            class: "10",
            section: "A",
            gender: "Female",
            parent: "Parent 3",
            phone: "9876543212"
        }
    ];

    localStorage.setItem("students", JSON.stringify(sampleStudents));
}

// Load students
function getStudents() {
    return JSON.parse(localStorage.getItem("students")) || [];
}

// Save students
function saveStudents(data) {
    localStorage.setItem("students", JSON.stringify(data));
}

// ===============================
// Register Student
// ===============================
function registerStudent() {

    const student = {
        name: document.getElementById("name").value,
        roll: document.getElementById("roll").value,
        class: document.getElementById("class").value,
        section: document.getElementById("section").value
    };

    let students = getStudents();

    students.push(student);

    saveStudents(students);

    alert("Student Registered Successfully");

    location.reload();

}

// ===============================
// Display Students
// ===============================
function displayStudents() {

    const table = document.getElementById("studentTable");

    if (!table) return;

    table.innerHTML = "";

    let students = getStudents();

    students.forEach((student, index) => {

        table.innerHTML += `
        <tr>
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>

            <td>
                <select class="form-select attendanceStatus">
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                </select>
            </td>

            <td>
                <button class="btn btn-danger btn-sm"
                onclick="deleteStudent(${index})">
                Delete
                </button>
            </td>

        </tr>
        `;

    });

    updateDashboard();

}

// ===============================
// Delete Student
// ===============================
function deleteStudent(index){

    let students = getStudents();

    students.splice(index,1);

    saveStudents(students);

    displayStudents();

}

// ===============================
// Search Student
// ===============================
function searchStudent(){

    let input=document.getElementById("search").value.toLowerCase();

    let rows=document.querySelectorAll("#studentTable tr");

    rows.forEach(row=>{

        if(row.innerText.toLowerCase().includes(input))
            row.style.display="";

        else
            row.style.display="none";

    });

}

// ===============================
// Dashboard (Attendance page)
// ===============================
function updateDashboard(){

    let students=getStudents();

    let total=students.length;

    let present=document.querySelectorAll(".attendanceStatus");

    let presentCount=0;

    present.forEach(item=>{

        if(item.value==="Present")
            presentCount++;

    });

    let absentCount=total-presentCount;

    let percentage=0;

    if(total>0){

        percentage=((presentCount/total)*100).toFixed(1);

    }

    if(document.getElementById("totalStudents"))
        document.getElementById("totalStudents").innerText=total;

    if(document.getElementById("presentStudents"))
        document.getElementById("presentStudents").innerText=presentCount;

    if(document.getElementById("absentStudents"))
        document.getElementById("absentStudents").innerText=absentCount;

    if(document.getElementById("attendancePercentage"))
        document.getElementById("attendancePercentage").innerText=percentage+"%";

}

displayStudents();

document.addEventListener("change",function(e){

    if(e.target.classList.contains("attendanceStatus")){

        updateDashboard();

    }

});

// ===============================
// Save Attendance
// ===============================
function markAttendance() {

    let attendance = [];

    document.querySelectorAll("#studentTable tr").forEach(row => {

        let cells = row.querySelectorAll("td");
        let status = row.querySelector(".attendanceStatus").value;

        attendance.push({
            name: cells[0].innerText,
            roll: cells[1].innerText,
            class: cells[2].innerText,
            section: cells[3].innerText,
            status: status
        });

    });

    localStorage.setItem("attendance", JSON.stringify(attendance));

    alert("Attendance Saved Successfully!");
}

// ===============================
// Mark All Present
// ===============================
function markAllPresent() {

    document.querySelectorAll(".attendanceStatus").forEach(item => {

        item.value = "Present";

    });

    updateDashboard();

}

// ===============================
// Mark All Absent
// ===============================
function markAllAbsent() {

    document.querySelectorAll(".attendanceStatus").forEach(item => {

        item.value = "Absent";

    });

    updateDashboard();

}

// =====================================
// Export Report as CSV
// =====================================
function exportCSV() {

    let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

    if (attendance.length === 0) {
        alert("No attendance data found!");
        return;
    }

    let csv = "Name,Roll,Class,Section,Status\n";

    attendance.forEach(student => {

        csv += `${student.name},${student.roll},${student.class},${student.section},${student.status}\n`;

    });

    let blob = new Blob([csv], { type: "text/csv" });

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Attendance_Report.csv";

    link.click();

}

// ================================
// REPORT PAGE
// ================================
function loadReport() {

    let students = JSON.parse(localStorage.getItem("students")) || [];
    let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

    let table = document.getElementById("reportTable");

    if (!table) return;

    table.innerHTML = "";

    let present = 0;
    let absent = 0;

    students.forEach(student => {

        let status = "Absent";

        let record = attendance.find(a => a.roll == student.roll);

        if (record) {
            status = record.status;
        }

        if (status === "Present")
            present++;
        else
            absent++;

        table.innerHTML += `
        <tr>
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td class="${status === 'Present' ? 'text-success fw-bold' : 'text-danger fw-bold'}">${status}</td>
        </tr>`;
    });

    let totalEl = document.getElementById("totalStudents");
    let presentEl = document.getElementById("presentStudents");
    let absentEl = document.getElementById("absentStudents");
    let percentEl = document.getElementById("attendancePercent") || document.getElementById("attendancePercentage");

    let percentage = students.length
        ? ((present / students.length) * 100).toFixed(1)
        : 0;

    if (totalEl) totalEl.innerText = students.length;
    if (presentEl) presentEl.innerText = present;
    if (absentEl) absentEl.innerText = absent;
    if (percentEl) percentEl.innerText = percentage + "%";

    // Chart handling (isolated so a missing Chart.js can't break the rest)
    try {
        let chart = document.getElementById("attendanceChart");
        if (chart && typeof Chart !== "undefined") {
            new Chart(chart, {
                type: "pie",
                data: {
                    labels: ["Present", "Absent"],
                    datasets: [{
                        data: [present, absent],
                        backgroundColor: ["#198754", "#dc3545"]
                    }]
                }
            });
        }
    } catch (e) {
        console.log("Chart generation skipped or pending library load:", e);
    }

}

window.onload = loadReport;

// ===============================
// Login
// ===============================
function login(event) {
    if (event) event.preventDefault();

    let usernameEl = document.getElementById("username");
    let passwordEl = document.getElementById("password");

    if (!usernameEl || !passwordEl) {
        console.error("Login inputs not found in HTML!");
        return;
    }

    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();

    if (username === "admin" && password === "admin123") {
        alert("Login successful!");
        window.location.href = "attendance.html";
    } else {
        alert("Invalid username or password!");
    }
}

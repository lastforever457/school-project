let editingClassId = null;

document.addEventListener("DOMContentLoaded", () => {
    teacherSelectOptions();
    renderClasses();
    document
        .querySelector("#addClassForm")
        .addEventListener("submit", handleAddOrUpdateClass);
});

let classTable = document.querySelector("#class-table");

let classModal = new bootstrap.Modal(document.querySelector("#classModal"));

function renderClasses() {
    let getClasses = localStorage.getItem("classes");
    let classes = getClasses ? JSON.parse(getClasses) : [];
    let getStudents = localStorage.getItem("students");
    let students = getStudents ? JSON.parse(getStudents) : [];

    classTable.innerHTML = "";

    classes.forEach((clasS) => {
        let studentsCount = students.filter(s => s.class === clasS.className).length;
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${clasS.id}</td>
            <td>${clasS.className}</td>
            <td>${clasS.classTeacher}</td>
            <td>${studentsCount}</td>
            <td>
                <button class="btn text-warning edit-class-btn" data-id="${clasS.id}"><i class="text-warning fas fa-edit"></i></button>
                <button class="btn text-danger delete-class-btn" data-id="${clasS.id}"><i class="text-danger fas fa-trash"></i></button>
            </td>
        `;
        classTable.appendChild(row);
    });

    document.querySelectorAll(".edit-class-btn").forEach((button) => {
        button.addEventListener("click", handleEditClass);
    });

    document.querySelectorAll(".delete-class-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClass);
    });
}

function teacherSelectOptions() {
    let getTeacher = localStorage.getItem("teachers");
    let teachers = getTeacher ? JSON.parse(getTeacher) : [];
    let newClassSelect = document.querySelector("#newClassTeacher");

    newClassSelect.innerHTML = '<option value="default">Select class</option>';
    teachers.forEach((clasS) => {
        let classOption = document.createElement("option");
        classOption.value = `${clasS.firstName} ${clasS.lastName}`;
        classOption.textContent = `${clasS.firstName} ${clasS.lastName}`;
        newClassSelect.appendChild(classOption);
    });
}

function handleAddOrUpdateClass(event) {
    event.preventDefault();
    let newClassName = document.querySelector("#newClassName").value;
    let newClassSelect = document.querySelector("#newClassTeacher").value;

    let getClasss = localStorage.getItem("classes");
    let classes = getClasss ? JSON.parse(getClasss) : [];

    let getStudent = localStorage.getItem("students");
    let students = getStudent ? JSON.parse(getStudent) : [];

    if (editingClassId) {
        let classToEdit = classes.find((clasS) => clasS.id === editingClassId);
        classToEdit.className = newClassName;
        classToEdit.classTeacher = newClassSelect;
        console.log("Updated class:", classToEdit);
    } else {
        let newClass = {
            id: Date.now(),
            className: newClassName,
            classTeacher: newClassSelect,
            classStudents: 0,
        };
        classes.push(newClass);
        console.log("Added new class:", newClass);
    }

    localStorage.setItem("classes", JSON.stringify(classes));
    renderClasses();
    document.querySelector("#newClassName").value = "";
    document.querySelector("#newClassTeacher").value = "";
    editingClassId = null;
    classModal.hide();
}

function handleEditClass(event) {
    classModal.show();
    let classId = parseInt(event.currentTarget.getAttribute("data-id"));
    editingClassId = classId;
    let getClasss = localStorage.getItem("classes");
    let classes = getClasss ? JSON.parse(getClasss) : [];
    let classToEdit = classes.find((clasS) => clasS.id === classId);

    document.querySelector("#newClassName").value = classToEdit.className;
    document.querySelector("#newClassTeacher").value = classToEdit.classTeacher;
    console.log("Editing class:", classToEdit);
}

function handleDeleteClass(event) {
    let classId = parseInt(event.currentTarget.getAttribute("data-id"));
    let getClasss = localStorage.getItem("classes");
    let classes = getClasss ? JSON.parse(getClasss) : [];
    classes = classes.filter((clasS) => clasS.id !== classId);
    localStorage.setItem("classes", JSON.stringify(classes));
    renderClasses();
}
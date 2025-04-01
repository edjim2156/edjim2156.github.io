document.addEventListener("DOMContentLoaded", function () {
    // Prepopulate the form with your data
    document.getElementById("name-input").value = "Edwin Jimenez";
    document.getElementById("mascot").value = "Ecstatic Jaguar";
    document.getElementById("image-caption").value = "Outside in the snow - NC";
    document.getElementById("personal-background").value = "Born out of state but raised in NC.";
    document.getElementById("professional-background").value = "Aspiring software developer.";
    document.getElementById("academic-background").value = "Studying Computer Science.";
    document.getElementById("webdev-background").value = "Experience with HTML, CSS, and JavaScript.";
    document.getElementById("primary-computer").value = "MacBook";
    document.getElementById("funny-thing").value = "N/A";
    document.getElementById("anything-else").value = "N/A";

    // Dynamic Course Fields
    const courseContainer = document.getElementById("course-container");
    const addCourseBtn = document.getElementById("add-class-btn");

    const prepopulatedCourses = [
        "ITIS 3135 - Web-Based Application Design and Development",
        "ITIS 3200 - Introduction to Information Security and Privacy",
        "ITSC 3135 - Software Engineering",
        "ITSC 3146 - Introduction to Operating Systems and Networking",
        "STAT 2122 - Introduction to Probability and Statistics"
    ];

    // Populate courses
    prepopulatedCourses.forEach((course) => {
        const div = document.createElement("div");
        div.classList.add("course-field");

        const input = document.createElement("input");
        input.type = "text";
        input.value = course;
        input.classList.add("class-input");
        input.required = true;
        div.appendChild(input);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.type = "button";
        deleteBtn.addEventListener("click", function () {
            div.remove();
        });
        div.appendChild(deleteBtn);

        courseContainer.appendChild(div);
    });

    // Add new course field dynamically
    addCourseBtn.addEventListener("click", function () {
        const div = document.createElement("div");
        div.classList.add("course-field");

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter a course";
        input.classList.add("class-input");
        input.required = true;
        div.appendChild(input);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.type = "button";
        deleteBtn.addEventListener("click", function () {
            div.remove();
        });
        div.appendChild(deleteBtn);

        courseContainer.appendChild(div);
    });

    // Handle image upload
    let uploadedImage = "images/me.jpg"; // Default image

    document.getElementById("file-upload").addEventListener("change", function (event) {
        const file = event.target.files[0];
        const fileError = document.getElementById("file-error");
        
        if (file) {
            if (file.type === "image/png" || file.type === "image/jpeg") {
                uploadedImage = URL.createObjectURL(file);
                fileError.style.display = "none";
            } else {
                fileError.style.display = "block";
                event.target.value = ""; // Clear the invalid file
            }
        }
    });

    // Handle form submission - UPDATED VERSION
    const form = document.getElementById("intro-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Validate form
        if (!form.checkValidity()) {
            alert("Please fill out all required fields");
            return;
        }

        // Gather input values
        const name = document.getElementById("name-input").value;
        const mascot = document.getElementById("mascot").value;
        const imageCaption = document.getElementById("image-caption").value;
        const personalBackground = document.getElementById("personal-background").value;
        const professionalBackground = document.getElementById("professional-background").value;
        const academicBackground = document.getElementById("academic-background").value;
        const webdevBackground = document.getElementById("webdev-background").value;
        const primaryComputer = document.getElementById("primary-computer").value;
        const funnyThing = document.getElementById("funny-thing").value;
        const anythingElse = document.getElementById("anything-else").value;

        // Gather courses
        const courses = [];
        document.querySelectorAll(".class-input").forEach((input) => {
            if (input.value.trim()) courses.push(input.value.trim());
        });

        // Create the final display
        const finalContent = `
            <div id="generated-content">
                <h2 class="heading-2">${name}'s ${mascot} Introduction</h2>
                
                <figure>
                    <img src="${uploadedImage}" alt="User uploaded image">
                    <figcaption>${imageCaption}</figcaption>
                </figure>

                <section>
                    <h3>Personal Background</h3>
                    <ul>
                        <li>${personalBackground}</li>
                    </ul>
                </section>
                
                <section>
                    <h3>Professional Background</h3>
                    <ul>
                        <li>${professionalBackground}</li>
                    </ul>
                </section>
                
                <section>
                    <h3>Academic Background</h3>
                    <ul>
                        <li>${academicBackground}</li>
                    </ul>
                </section>

                <section>
                    <h3>Web Development Background</h3>
                    <ul>
                        <li>${webdevBackground}</li>
                    </ul>
                </section>
                
                <section>
                    <h3>Primary Computer Platform</h3>
                    <ul>
                        <li>${primaryComputer}</li>
                    </ul>
                </section>
                
                <section>
                    <h3>Courses I'm Taking</h3>
                    <ul>
                        ${courses.map((course) => `<li>${course}</li>`).join('')}
                    </ul>
                </section>
                
                ${funnyThing ? `
                <section>
                    <h3>Anything Funny?</h3>
                    <ul>
                        <li>${funnyThing}</li>
                    </ul>
                </section>` : ''}

                ${anythingElse ? `
                <section>
                    <h3>Anything Else?</h3>
                    <ul>
                        <li>${anythingElse}</li>
                    </ul>
                </section>` : ''}
                
                <button id="reset-form" class="edit-btn">Edit Form Again</button>
            </div>
        `;

        // Replace the form with the new content
        const formContainer = form.parentElement;
        formContainer.innerHTML = finalContent;

        // Add event listener to the reset button
        document.getElementById("reset-form").addEventListener("click", function() {
            location.reload(); // Reloads the page to reset everything
        });
    });
});
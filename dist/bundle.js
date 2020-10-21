"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    function autobind(_, _2, descriptor) {
        const originalMethod = descriptor.value;
        const adjDesciptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            }
        };
        return adjDesciptor;
    }
    App.autobind = autobind;
})(App || (App = {}));
var App;
(function (App) {
    class Component {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            const importedHtmlContent = document.importNode(this.templateElement.content, true);
            this.element = importedHtmlContent.firstElementChild;
            newElementId && (this.element.id = newElementId);
            this.attach(insertAtStart);
        }
        attach(insertAtStart) {
            this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    class ProjectInput extends Component {
        constructor() {
            super('project-input', 'app', true, 'user-input');
            this.titleInput = this.element.querySelector('#title');
            this.descriptionInput = this.element.querySelector('#description');
            this.peopleInput = this.element.querySelector('#people');
            this.configure();
        }
        gatherUserInput() {
            const enteredTitle = this.titleInput.value;
            const enteredDescription = this.descriptionInput.value;
            const enteredPeople = this.peopleInput.value;
            const resultTitleValidation = {
                value: enteredTitle,
                required: true,
                minLength: 3,
                maxLength: 12
            };
            const resultDescriptionValidation = {
                value: enteredDescription,
                minLength: 20,
                maxLength: 300
            };
            const resultPeopleValidation = {
                value: +enteredPeople,
                required: true,
                min: 1,
                max: 10
            };
            if (!validate(resultTitleValidation) ||
                !validate(resultDescriptionValidation) ||
                !validate(resultPeopleValidation)) {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
            else {
                throw new Error('Please make sure all fields are filled in correctly.');
                return;
            }
        }
        clearInputs() {
            this.titleInput.value = '';
            this.descriptionInput.value = '';
            this.peopleInput.value = '';
        }
        submitHundler(e) {
            e.preventDefault();
            const userInput = this.gatherUserInput();
            if (Array.isArray(userInput)) {
                const [title, desc, people] = userInput;
                projectState.addProject(title, desc, people);
                this.clearInputs();
            }
        }
        configure() {
            this.element.addEventListener('submit', this.submitHundler);
        }
        renderContent() { }
    }
    __decorate([
        App.autobind
    ], ProjectInput.prototype, "submitHundler", null);
    class ProjectItem extends Component {
        constructor(hostId, project) {
            super('single-project', hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        get persons() {
            if (this.project.people === 1) {
                return '1 person';
            }
            else {
                return `${this.project.people} persons`;
            }
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndHandler(_) {
        }
        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = this.persons + ' assigned.';
            this.element.querySelector('p').textContent = this.project.description;
        }
    }
    __decorate([
        App.autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        App.autobind
    ], ProjectItem.prototype, "dragEndHandler", null);
    class ProjectList extends Component {
        constructor(type) {
            super('project-list', 'app', false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] == 'text/plain') {
                event.preventDefault();
                const listEl = this.element.querySelector('ul');
                listEl.classList.add('droppable');
            }
        }
        dropHandler(event) {
            const prjId = event.dataTransfer.getData('text/plain');
            projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const listEl = this.element.querySelector('ul');
            listEl.classList.remove('droppable');
        }
        configure() {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('drop', this.dropHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            projectState.addListeners((projects) => {
                const relevantProjects = projects.filter(project => {
                    if (this.type === 'active') {
                        return project.status === ProjectStatus.Active;
                    }
                    else {
                        return project.status === ProjectStatus.Finished;
                    }
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderContent() {
            const listId = `${this.type}-project-list`;
            this.element.querySelector('ul').id = listId;
            this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        }
        renderProjects() {
            const listEl = document.getElementById(`${this.type}-project-list`);
            listEl.innerHTML = '';
            for (const proItem of this.assignedProjects) {
                new ProjectItem(this.element.querySelector('ul').id, proItem);
            }
        }
    }
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    new ProjectInput();
    new ProjectList('active');
    new ProjectList('finished');
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map
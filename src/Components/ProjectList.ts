/// <reference path="BaseComponent.ts"/>
/// <reference path="./ProjectItem.ts" />
/// <reference path='../Decorators/Autobind.ts'/>
/// <reference path='../State/ProjectState.ts'/>
/// <reference path='../Models/Project.ts'/>
/// <reference path='../Models/DragDrop.ts'/>

namespace App {
  // Project List Class
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
      super('project-list', 'app', false, `${type}-projects`);
      this.assignedProjects = [];
      this.configure();
      this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] == 'text/plain') {
        event.preventDefault();
        const listEl = this.element.querySelector('ul')! as HTMLUListElement;
        listEl.classList.add('droppable');
      }
    }
    @autobind
    dropHandler(event: DragEvent) {
      const prjId = event.dataTransfer!.getData('text/plain');
      projectState.moveProject(
        prjId,
        this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }
    @autobind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector('ul')! as HTMLUListElement;
      listEl.classList.remove('droppable');
    }

    configure() {
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('drop', this.dropHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHandler);

      projectState.addListeners((projects: Project[]) => {
        const relevantProjects = projects.filter(project => {
          if (this.type === 'active') {
            return project.status === ProjectStatus.Active;
          } else {
            return project.status === ProjectStatus.Finished;
          }
        });
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    renderContent() {
      const listId = `${this.type}-project-list`;
      this.element.querySelector('ul')!.id = listId;
      this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() {
      const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
      listEl.innerHTML = '';
      for (const proItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector('ul')!.id, proItem);
      }
    }
  }
}

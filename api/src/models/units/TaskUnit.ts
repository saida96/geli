import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';
import {ITaskModel, Task} from '../Task';
import {ITask} from '../../../../shared/models/task/ITask';
import {InternalServerError} from 'routing-controllers';

interface ITaskUnitModel extends ITaskUnit, mongoose.Document {
  export: () => Promise<ITaskUnit>;
  import: (taskUnit: ITaskUnit, courseId: string) => Promise<ITaskUnit>;
}

const taskUnitSchema = new mongoose.Schema({
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],
  deadline: {
    type: String
  },
});

// Cascade delete
taskUnitSchema.pre('remove', function(next: () => void) {
  Task.find({'_id': {$in: this.tasks}}).exec()
    .then((tasks) => Promise.all(tasks.map(task => task.remove())))
    .then(next)
    .catch(next);
});

taskUnitSchema.methods.export = function() {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties
  delete obj._course;

  // "populate" tasks
  const tasks: Array<mongoose.Types.ObjectId>  = obj.tasks;
  obj.tasks = [];

  return Promise.all(tasks.map((taskId) => {
    return Task.findById(taskId).then((task) => {
      return task.export();
    });
  }))
  .then((exportedTasks) => {
    obj.tasks = exportedTasks;
    return obj;
  });
}

taskUnitSchema.methods.import = function(taskUnit: ITaskUnit, courseId: string) {
  taskUnit._course = courseId;

  const tasks: Array<ITask>  = taskUnit.tasks;
  taskUnit.tasks = [];

  return new TaskUnit(taskUnit).save()
    .then((savedTaskUnit: ITaskUnitModel) => {
      const taskUnitId = savedTaskUnit._id;

      return Promise.all(tasks.map((task: ITask) => {
        return new Task().import(task);
      }))
        .then((importedUnits: ITask[]) => {
          savedTaskUnit.tasks.concat(importedUnits);
          return savedTaskUnit.save();
        });
    })
    .then((importedTaskUnit: ITaskUnitModel) => {
      return importedTaskUnit.toObject();
    })
    .catch((err: Error) => {
      const newError = new InternalServerError('Failed to import course');
      newError.stack += '\nCaused by: ' + err.stack;
      throw newError;
    });
}

const TaskUnit = Unit.discriminator('task', taskUnitSchema);

export {TaskUnit, ITaskUnitModel};

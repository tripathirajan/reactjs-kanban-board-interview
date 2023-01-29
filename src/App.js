import { useMemo, useRef, useState } from 'react';
import './App.css';

/**
 * @description  Button component
 * @param {Object} param0 component props
 * @returns 
 */
const Button = ({ children, color = "success", size, className = '', ...rest }) => {
  const btnSize = size ? `btn-${size}` : '';

  return (<button className={`btn btn-${color} ${btnSize} ${className}`} {...rest}>{children}</button>)
}
/**
 * @description  Stack component
 * @param {Object} param0 component props
 * @returns 
 */
const Stack = ({ children, direction = "row", alignItem = "center", justifyContent = "center", spacing = 0, className }) => {
  let classes = `flex flex-${direction} align-${alignItem} justify-${justifyContent} spacing-${spacing} ${className}`;
  return (<div className={classes}>
    {children}
  </div>)
}

/**
 * @description  Task Card component
 * @param {Object} param0 component props
 * @returns 
 */
const TaskCard = ({ text, onMoveLeft, onMoveRight, onDelete }) => {
  return (<div className='card flex flex-row align-center spacing-5'>
    <h3>{text}</h3>
    {onMoveLeft && <Button color='success' size="sm" onClick={onMoveLeft}>Move Left</Button>}
    {onMoveRight && <Button color='success' size="sm" onClick={onMoveRight}>Move Right</Button>}
    {onDelete && <Button color='danger' size="sm" onClick={onDelete}>DEL</Button>}
  </div>)
}
/**
 * @description  Task Section component
 * @param {Object} param0 component props
 * @returns 
 */
const TaskSection = ({ title, type = 'green', children }) => {
  return (<div className={`section section-${type}`}>
    <div className='header'>
      <h4>{title}</h4>
    </div>
    <div className=' mtb-10 flex flex-column align-center justify-center spacing-r-5'>
      {children}
    </div>
  </div>)
}

const taskStatus = {
  "todo": 0,
  "inprogress": 1,
  "completed": 2
}
function App() {
  const [tasks, setTasks] = useState([]);
  const inptRef = useRef(null);
  const todoTask = useMemo(() => { return tasks?.filter(({ status }) => status === taskStatus.todo) }, [tasks]);
  const inProgressTask = useMemo(() => { return tasks?.filter(({ status }) => status === taskStatus.inprogress) }, [tasks]);
  const completedTask = useMemo(() => { return tasks?.filter(({ status }) => status === taskStatus.completed) }, [tasks]);

  const handleTaskCreate = () => {
    const newTaskName = inptRef?.current?.value || '';
    if (!newTaskName) {
      return;
    }
    setTasks(prev => ([...prev, { title: newTaskName, status: taskStatus.todo, id: new Date().getTime() }]));
    inptRef.current.value = '';
  }
  const handleMoveTask = (taskId, moveTo = 0) => {
    if (!taskId || moveTo < 0) {
      return;
    }
    const updatedTaskList = tasks?.map(task => {
      if (task.id === taskId) {
        task.status = moveTo;
      }
      return task;
    })
    setTasks(updatedTaskList);
  }
  const handleDeleteTask = (taskId) => {
    if (!taskId) {
      return;
    }
    const updatedTaskList = tasks.filter(({ id }) => (id !== taskId));
    setTasks(updatedTaskList);
  }
  return (
    <div className="container">
      <h4>ReactJS Interview task - Kanban Board</h4>
      <Stack
        alignItem='center'
        justifyContent='center'
        spacing={10}
      >
        <input ref={inptRef} name="task-name" className='input-lg input' placeholder='eg. Task #1' />
        <Button type='button' color='success' size="md" onClick={handleTaskCreate}>Create Task</Button>
      </Stack>
      <Stack
        alignItem='start'
        justifyContent='space-evenly'
        spacing={10}
        className='full-width'
      >
        <TaskSection title="Todo" type="green">
          {
            todoTask?.map(task => (<TaskCard key={task?.id} text={task?.title}
              onDelete={() => { handleDeleteTask(task.id) }}
              onMoveRight={() => { handleMoveTask(task.id, taskStatus.inprogress) }}
            />))
          }

        </TaskSection>
        <TaskSection title="In-Progress" type="orange">
          {
            inProgressTask?.map(task => (<TaskCard
              key={task?.id}
              text={task?.title}
              onMoveRight={() => { handleMoveTask(task.id, taskStatus.completed) }}
              onMoveLeft={() => { handleMoveTask(task.id, taskStatus.todo) }}
            />))
          }

        </TaskSection>
        <TaskSection title="Completed" type="red">
          {
            completedTask?.map(task => (<TaskCard
              key={task?.id}
              text={task?.title}
              onDelete={() => { handleDeleteTask(task.id) }}
              onMoveLeft={() => { handleMoveTask(task.id, taskStatus.inprogress) }}
            />))
          }
        </TaskSection>
      </Stack>
    </div>
  );
}

export default App;

import React from 'react'

export const TodoList = ({ todos }) =>
	todos.map(todo => (
		<div key={todo.id}>
			#{todo.id} {todo.title}
		</div>
	))

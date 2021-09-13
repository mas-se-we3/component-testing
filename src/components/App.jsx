import React, { Component } from 'react'
import { UsersEndpoint, TodosEndpoint } from '../api'
import './App.css'
import { TodoList } from './TodoList'

class App extends Component {
	state = {
		users: [],
		todos: [],
		error: ''
	}

	controller = new AbortController()

	async componentDidMount() {
		try {
			await this.loadUsers()
		} catch (ex) {}
	}

	componentWillUnmount() {
		this.controller.abort()
	}

	render() {
		const { users, todos, error } = this.state

		return (
			<div className="app__container">
				<h1>My Users</h1>
				{error && <h4 role="alert">{error}</h4>}
				{users.map(user => (
					<div key={user.id}>{user.name}</div>
				))}
				<button onClick={this.loadTodos}>Load Todos</button>
				<TodoList todos={todos} />
			</div>
		)
	}

	loadUsers = async () => {
		const response = await fetch(UsersEndpoint, {
			signal: this.controller.signal
		})
		this.handleResponse(response, 'users')
	}

	loadTodos = async () => {
		const response = await fetch(TodosEndpoint)
		this.handleResponse(response, 'todos')
	}

	handleResponse = async (response, stateProp) => {
		if (response.ok) {
			this.setState({ [stateProp]: await response.json() })
		} else {
			this.setState({ error: 'Server Error' })
		}
	}
}

export default App

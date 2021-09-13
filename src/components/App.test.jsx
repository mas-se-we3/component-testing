import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import { TodosEndpoint, UsersEndpoint } from '../api'
import App from './App'

/*** Setup ***/

const handlers = [
	rest.get(UsersEndpoint, (req, res, ctx) => {
		return res(
			ctx.json([
				{ id: 1, name: 'Tobi' },
				{ id: 2, name: 'Patrik' }
			])
		)
	}),
	rest.get(TodosEndpoint, (req, res, ctx) => {
		return res(
			ctx.json([
				{ id: 1, title: 'Cooking' },
				{ id: 2, title: 'Cleaning' }
			])
		)
	})
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

/*** Tests ***/

test('renders title', async () => {
	render(<App />)

	const heading = await screen.findByRole('heading')

	expect(heading).toHaveTextContent('My Users')
})

test('fetches and renders Tobi', async () => {
	render(<App />)

	const tobi = await screen.findByText(/Tobi/)
	const patrik = await screen.findByText(/Patrik/)

	expect(tobi).toBeTruthy()
	expect(patrik).toBeTruthy()
})

test('fetches and renders todos', async () => {
	render(<App />)

	screen.getByText(/Load Todos/).click()
	const cooking = await screen.findByText(/Cooking/)
	const cleaning = await screen.findByText(/Cleaning/)

	expect(cooking).toBeTruthy()
	expect(cleaning).toBeTruthy()
})

test('handles todo API error', async () => {
	server.use(rest.get(UsersEndpoint, (req, res, ctx) => res(ctx.status(500))))

	render(<App />)
	const alertElement = await screen.findByRole('alert')

	expect(alertElement).toHaveTextContent(/Server Error/)
})

default: build

.PHONY: tasks
tasks: ## Print available tasks
	@printf "\nUsage: make [target]\n\n"
	@grep -E '^[a-z][^:]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: backend/install
backend/install: ## Install backend dependencies
	npm --prefix backend install

.PHONY: frontend/install
frontend/install: ## Install frontend dependencies
	npm --prefix frontend install

.PHONY: install
install: backend/install frontend/install ## Install all dependencies
	npm install

.PHONY: backend/lint
backend/lint: backend/install ## Lint backend
	npm --prefix backend run lint

.PHONY: backend/test
backend/test: backend/lint ## Test backend
	npm --prefix backend run test

.PHONY: backend/build
backend/build: backend/test ## Build backend
	npm --prefix backend run build

.PHONY: frontend/lint
frontend/lint: frontend/install ## Lint frontend
	npm --prefix frontend run lint

.PHONY: frontend/test
frontend/test: frontend/lint ## Test frontend
	npm --prefix frontend run test

.PHONY: frontend/build
frontend/build: frontend/test ## Build frontend
	npm --prefix frontend run build

.PHONY: build
build: backend/build frontend/build ## Build all

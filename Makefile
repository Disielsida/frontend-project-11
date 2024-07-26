install:
	npm ci

lint: 
	npx eslint .

test:
	npx jest

build:
	npm run build

start:
	npm run start
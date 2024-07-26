install:
	npm ci

lint: 
	npx eslint .

test:
	npx jest

buildDev:
	npm run build:dev

buildProd:
	npm run build:prod

serve:
	npm run serve
class Point{
		   	constructor(x,y){
				this.x=x;
				this.y=y;
			}
			distanceTo(point){
				let dx=point.x-this.x;
				let dy=point.y-this.y;
				return Math.sqrt(dx*dx+dy*dy);
			}
			move(x, y){
				this.x+=x;
				this.y+=y;
			}

		}

		class Ingredient{
			constructor(name, quantity, price){
				this.name=name;
				this.quantity=quantity;
				this.price=price;
				
			}

			addQuantity(){
				return this.quantity=parseInt(this.quantity)+1;
			}
		}
		let pizza;
		let dragTarget=null;
		let container;
		let ingredients=null;
		let ingredient;
		let recipeElemArea;
		let souces=[];
		function getPizzaCentre(){
			let rect=pizza.getBoundingClientRect();
			let cx=rect.left+rect.width/2;
			let cy=rect.top+rect.height/2;
			return new Point(cx, cy);
		}
		function getPizzaRadius(){
			let rect=pizza.getBoundingClientRect();
			return rect.width/2;
		}

		function setDragTargetPos(point){
			let rect = dragTarget.getBoundingClientRect();
			point.move(-rect.width/2, -rect.height/2);
			dragTarget.style.left=point.x+"px";
			dragTarget.style.top=point.y+"px";

		}
		
		function getPosOnPizza(mousePos){
			let rect=pizza.getBoundingClientRect();
			return new Point(mousePos.x-rect.x, mousePos.y-rect.y);
		}
		function addIngredient(dragTarget){
			ingredient=new Ingredient(dragTarget.dataset.name, '1', dragTarget.dataset.price);
			ingredients.push(ingredient);
			console.log(ingredients);
		}

		function createRecipeElem(ingredient){
			let recipeIngredArea=document.querySelector('.recipe__list_ingredients');
			let recipeElem=document.createElement('div');
			let recipeElemName=document.createElement('div');
			let recipeElemQuantity=document.createElement('div');
			let recipeElemPrice=document.createElement('div');
			let recipeElemTotalPrice=document.createElement('div');
			recipeElemName.append(ingredient.name+' ');
			recipeElemQuantity.append(ingredient.quantity+' ');
			recipeElemPrice.append(ingredient.price+' ');
			recipeElemTotalPrice.append(parseInt(ingredient.price)*parseInt(ingredient.quantity));
			recipeElem.append(recipeElemName);
			recipeElem.append(recipeElemQuantity);
			recipeElem.append(recipeElemPrice);
			recipeElem.append(recipeElemTotalPrice);
			recipeElem.classList.add('recipe__list_ingredients-elem');
			recipeIngredArea.append(recipeElem);
			return recipeIngredArea;

		}

		function createRecipeElemSouce(ingredient){
			let recipeSoucesArea=document.querySelector('.recipe__list_souces');
			let recipeElem=document.createElement('div');
			let recipeElemName=document.createElement('div');
			let recipeElemPrice=document.createElement('div');
			recipeElemName.append(ingredient.name+' ');
			recipeElemPrice.append(ingredient.price+' ');
			recipeElem.append(recipeElemName);
			recipeElem.append(recipeElemPrice);
			recipeSoucesArea.append(recipeElem);
			recipeElem.classList.add('recipe__list_souces-elem');
			return recipeSoucesArea;

}
		let sum=0;

		function countTotalPrice(ingredient){
			 sum+=parseInt(ingredient.price)*parseInt(ingredient.quantity);
			return sum;
		}

		function addRecipeElem(ingredient){
			if(ingredients==null){
							ingredients=[];
							ingredient=new Ingredient(dragTarget.dataset.name, '1', dragTarget.dataset.price);
							ingredients.push(ingredient);
						}
						else{
						let index=ingredients.findIndex((e,i)=>
							ingredients[i].name==dragTarget.dataset.name);
						if(index==-1) {
							ingredient=new Ingredient(dragTarget.dataset.name, '1', dragTarget.dataset.price);
							ingredients.push(ingredient);
							return ingredients;
						}
						else ingredients[index].addQuantity();
						}
		}

		document.addEventListener('DOMContentLoaded', ()=>{
			pizza=document.querySelector('.pizza');
			let leftBar=document.querySelector('.leftbar')
			leftBar.addEventListener('mousedown', e=>{
				let mousePoint=new Point(e.clientX, e.clientY);
				if(e.target.matches('.ingredient')){
					dragTarget=e.target.cloneNode();
					dragTarget.style.position='fixed';
					document.body.append(dragTarget);
					setDragTargetPos(mousePoint);
				}

			})
			window.addEventListener('mousemove', e=>{
				if(dragTarget){
					setDragTargetPos(new Point(e.clientX, e.clientY));
				}
			})
			window.addEventListener('mouseup', e=>{
				if(dragTarget){
					let pizzaCentre=getPizzaCentre();
					let pizzaRadius=getPizzaRadius();
					let mousePos=new Point(e.clientX, e.clientY);
					let d=pizzaCentre.distanceTo(mousePos);
					if(d<pizzaRadius){
						let newPos=getPosOnPizza(mousePos);
						setDragTargetPos(newPos);
						pizza.append(dragTarget);
						dragTarget.style.position='absolute';
						addRecipeElem(dragTarget);
						dragTarget=null;
						
					}else {
					dragTarget.remove();
					dragTarget=null;
					}
				}
			})
			window.addEventListener('change', e=>{
				if(e.target.matches('.souce')){
					let checkbox=e.target;
					if(checkbox.checked){
						ingredient=new Ingredient(checkbox.dataset.name, '1', checkbox.dataset.price);
						souces.push(ingredient);
					}
					else {
						let index=souces.findIndex((e,i)=>
							souces[i].name==checkbox.dataset.name);
						souces.splice(index, index);
					}
						
				}
			})

			window.addEventListener('click', e=>{
				container=document.querySelector('.container');
				if(e.target.matches('.btn')){
					container.style.display='none';
					let recipeScreen=document.querySelector('.recipe-screen');
					recipeScreen.style.display='flex';
					ingredient=new Ingredient('Base', '1', '10');
					ingredients.unshift(ingredient);
					let allIngredients=ingredients.concat(souces);
					console.log=(allIngredients);
					allIngredients.forEach(i=>countTotalPrice(i));
					ingredients.map(i=>createRecipeElem(i));
					souces.map(i=>createRecipeElemSouce(i));
					let recipeTotalSum=document.querySelector('.recipe__list_total-price');
					recipeTotalSum.append('Total:'+' '+sum);

					
				}
			})
							
		})
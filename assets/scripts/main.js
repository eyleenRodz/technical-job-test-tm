
let itemsPortfolio  = [] //Almacena los json guardados. 
let currentPage = 0 // Pagina actual de paginado.
const totalItemsPerPage = 1 //Total de itemes que se muestran por pagina


function goToPortfolio(){
  document.location.href=document.location.href.split("#")[0]+"#portfolio";
}
function filterCategory(e){
  let value = e.getAttribute('value');
  if(value!="All"){
    document.location.href=document.location.href.split("?")[0]+"?cat="+value;
  }else{
    document.location.href=document.location.href.split("?")[0]
  }
}

/**
* Funcion que obtiene un valor de query params de una url
* @param {String} name Nombre del query param a obtener
* @param {String} url Url del que se obtiene el valor de query param. Por defecto window.location.href
* @returns Valor del query param 
*/
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
* Función que filtra los elementos por una categoria de query param. 
* @param {*} items Listado de items.
* @returns Items filtrado u original si no hay query param
*/
function filterByQueryCategory(items){
  if(document.location.search && document.location.search != ""){
    let category = getParameterByName("cat")
    return items.filter(item=>!category || item.category === category);
  }else {
    return items
  }
}

/**
* Función que filtra los elementos por un texto
* @param {*} items Listado de items.
* @returns Items filtrado u original si no hay query param
*/
function filterByQuery(items){
  if(document.location.search && document.location.search != ""){
    let text = getParameterByName("q")
    if (text && text !=""){ 
      return items.filter(item=> (""+item.category+item.title).toLowerCase().includes(text.toLowerCase()) );
    }
    else {
      return items
    }
  }else {
    return items
  }
}
/**
* Pagina los items
* @param {*} items
*/
function paginatorItem(items=[]){
  return items.slice((currentPage*totalItemsPerPage),((currentPage*totalItemsPerPage) + totalItemsPerPage))
}

/**
* Funcion que dependiendo del json agrega los items en el html.
* @param {Array} items Listado de items.
*/
function buildItems(items){
  try {
    if ('content' in document.createElement('template')) {
      let template = document.getElementsByTagName("template")[0];
      let portfolioSection = document.getElementById("portfolio-items");
      for (const index in items) {
        let contentTemplate = template.content.cloneNode(true);
        let newItem = contentTemplate.firstChild
        newItem.setAttribute("category", items[index].category)
        newItem.setAttribute("index", index)
        let articlehtmttext = newItem.innerHTML
        
        newItem.innerHTML = articlehtmttext.replace("{{TITLE}}", items[index].title).replace("{{CATEGORY}}", items[index].category)
        portfolioSection.appendChild(newItem)
      }
    }else{alert(1)}
  } catch (error) {
    console.log(error);
  }
}

/**
* Funcion que carga el json y filtra los resultados. 
*/
async function  loadJSON(){
  try {
    let url = document.location.pathname.replace('index','items').replace('html','json')
    if(document.location.href.startsWith('file')){
      console.log('what');
      url = "file://"+url
    }
    
    itemsPortfolio = filterByQueryCategory(globalItems)
    console.log(itemsPortfolio);
    itemsPortfolio = filterByQuery(itemsPortfolio);
    currentPage = 0
    let itemsPaginated = paginatorItem(itemsPortfolio);
    buildItems(itemsPaginated)
  } catch (error) {
    console.error('errrr   ',JSON.stringify(error), error.message)
  }
}

/**
* Funcion que permite ver mas items
*/
function showMore(e){
  currentPage++;
  let items = paginatorItem(itemsPortfolio);
  buildItems(items)
}


/**
* Función que activa una categoria si esta filtrada  
*/
function activeFilterCateogry(){
  let category = getParameterByName("cat")
  console.log('category val', category);
  if(!category) category = "All"

  let itemsCategory = document.querySelectorAll(`li[value=${category}]`)
  for (const itemCategory of itemsCategory) {
    itemCategory.classList.add('active');
  }
  
}

window.onload = ()=>{  
  let searchText = document.getElementById("search_term_text")
  searchText.value = getParameterByName("q")
  loadJSON()
  activeFilterCateogry();
}
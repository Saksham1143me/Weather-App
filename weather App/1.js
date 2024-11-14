const usertab=document.querySelector(".your")
const searchtab=document.querySelector(".search")
const grantcontainer=document.querySelector(".permission")
const searchbox=document.querySelector(".searchbox")
const loader=document.querySelector(".loader")
const result=document.querySelector(".result")
const errorMessage=document.querySelector(".error")
const errorImage = document.querySelector(".errImg");
console.log(errorImage); // Check if errorImage is correctly selected
grantcontainer.classList.add("active")
let currenttab=usertab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
function switchtab(clickedtab){
  if(clickedtab!=currenttab){
    currenttab.classList.remove("currentcss")
    currenttab=clickedtab;
    currenttab.classList.add("currentcss")
    if(!searchbox.classList.contains("active")){
        searchbox.classList.add("active")
        grantcontainer.classList.remove("active")
        result.classList.remove("active")
  errorMessage.classList.remove("active")
  errorImage.classList.remove("active")
    }
    else{
        searchbox.classList.remove("active")
        grantcontainer.classList.add("active")
        result.classList.remove("active")
        getfromsessionstorage()
    }
}
}
currenttab.classList.add("currentcss")
usertab.addEventListener("click",()=>{
    switchtab(usertab)
})
searchtab.addEventListener("click",()=>{
 switchtab(searchtab)
})
// to check that user has already given location access :
async function getfromsessionstorage(){
    const localstorage=sessionStorage.getItem("user-location")
    if(!localstorage){
        grantcontainer.classList.add("active")
  errorMessage.classList.remove("active");
    }
    else{
        const location=JSON.parse(localstorage);
        fetchUserWeatherInfo(location);
    }
}
async function fetchUserWeatherInfo(location){
  
 const {lat,lon}=location;
 grantcontainer.classList.remove("active")
 errorMessage.classList.remove("active");
 loader.classList.add("active")
//  api call
try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data=await res.json()
    if (!res.ok) throw new Error("Failed to fetch weather data");
    if (data.cod !== 200) {
      throw new Error(data.message);
    }
  errorMessage.classList.remove("active");
    loader.classList.remove("active")
    result.classList.add("active");
    // to show data to UI:
    renderWeatherInfo(data);
}
catch(err){
    loader.classList.remove("active");
    result.classList.remove("active");
    errorMessage.innerText = "Failed to fetch weather data. Please try again later.";
    errorMessage.classList.add("active");
    errorImage.src="assets/th.jpg"
    errorImage.classList.add("active");
}
}
function renderWeatherInfo(data){
    const cityName=document.querySelector("[data-cityName]")
    const countryflag=document.querySelector("[data-countryflag]")
    const condition=document.querySelector("[data-condition]")
    const weathericon=document.querySelector("[data-weathericon]")
    const temperature=document.querySelector("[data-temperature]")
    const windspeed=document.querySelector("[data-windspeed]")
    const humidity=document.querySelector("[data-humidity]")
    const clouds=document.querySelector("[data-clouds]")
    // fetching from api:
    cityName.innerText=data?.name;
    // we can get flag of any country using cdn:
    countryflag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    condition.innerText=data?.weather?.[0]?.description;
    weathericon.src=`http://openweathermap.org/img/w/${data ?. weather ?. [0] ?. icon}.png`;
    temperature.innerText=data?.main?.temp;
    windspeed.innerText=data?.wind?.speed;
    humidity.innerText=data?.main?.humidity;
    clouds.innerText=data?.clouds?.all;
}
function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        alert("No Geolocation Support Available in Browser")
    }
}
// callback function:
function showPosition(position){
    const usercoordinates={
     lat:position.coords.latitude,
     lon:position.coords.longitude
    }
sessionStorage.setItem("user-location",JSON.stringify(usercoordinates))
fetchUserWeatherInfo(usercoordinates);
}
const grantbtn=document.querySelector(".grant")
grantbtn.addEventListener("click",getlocation);
const searchinput=document.querySelector("[data-searchInput]");
searchbutton=document.querySelector(".searchbox button");
searchbutton.addEventListener("click",(e)=>{
  e.preventDefault();
  let cityNameval=searchinput.value;
  if(cityNameval===""){
    return;
  }
  else{
    fetchSearchWeatherInfo(cityNameval);
  }
})
async function fetchSearchWeatherInfo(city){
    errorMessage.classList.remove("active");
loader.classList.add("active")
result.classList.remove("active")
grantcontainer.classList.remove("active");
try{
const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
const data=await res.json()
if (!res.ok || data.cod !== 200) {
    throw new Error(data.message || "Invalid city name");
  }
  errorMessage.classList.remove("active");
loader.classList.remove("active")
result.classList.add("active");
renderWeatherInfo(data);
}
catch(err){
    loader.classList.remove("active");
    result.classList.remove("active");
    errorMessage.innerText = "Failed to fetch weather data. Please try again later.";
    errorMessage.classList.add("active");
    // errorImage.src="assets/th.jpg"
    // errorImage.classList.add("active");
}
}
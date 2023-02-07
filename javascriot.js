
const letters = document.querySelectorAll(".contain");
const loadingstate = document.querySelector(".statusbar");
let row = 0;
let buffer = "";
let loading = false;



 async function init ()
{
    //setting aimation
    loading = true;
    isloading(true);

    //request for letter of the day 
    const apiresponse = await fetch("https://words.dev-apis.com/word-of-the-day");
    const apiresponseobject = await apiresponse.json()
    let words = apiresponseobject.word.toUpperCase();
    //done vaiable 
    let done = false;
    
    //stops when api data has been fetched
    loading = false;
    isloading(false);

    const splitword = words.split("");
    
    
    //check if letters contain more than one of itself 
    let check = ifcontainsdoublecheck(splitword); 
    
    //when user presses enter
    async function commit(){

         //validate for corect word
        loading = true;
        isloading(true);

        const resp = await fetch("https://words.dev-apis.com/validate-word", {
            method : "POST", 
            body : JSON.stringify({word : buffer})
        });

        const responsevalidate = await resp.json();
        const validword = responsevalidate.validWord; 

        loading = false;
        isloading(false);

        if (validword === false){
            alertforinvalid();
            return;
        } 


        //split word 
        buffer = buffer.toUpperCase();
        const splitbuffer = buffer.split("");

       if (buffer.length !== 5){
            return;
       }
        
       else{

        for (let x = 0; x < 5; x++){
        
            if(splitbuffer[x] === splitword[x]){
    
                letters[row * 5 + x].classList.add("correct");
                check[splitbuffer[x]]--;
                
            }
            
           }


            for (let x = 0; x < 5; x++){
            
            if(splitbuffer[x] === splitword[x]){
    
                //do nothing
            }
    
            else if(splitword.includes(splitbuffer[x]) && check[splitbuffer[x]]  !== 0 ){
                
                //checkif close 
                letters[row * 5 + x].classList.add("close");
                check[splitbuffer[x]]--;
            }
    
            else{
                
                letters[row * 5 + x].classList.add("wrong");
            }

       }

       }

    //increment the rows after each round 
       row++;

    //TODO did they win ?
    if (buffer === words){

            alert(`you win`);
            document.querySelector(".bannar").classList.add("winner");
            done = true;
            return;
              
        }

    else if (row === 6)
    {
        alert(`You loose the correct word was ${words}`);
        done = true;
    }  

       buffer = "";

    }

    function poplastletter(){
        if (buffer.length === 0){
            
            return;
        }

        else{
            //remove from array
            buffer = buffer.substring(0, buffer.length -1);
        }
        
        //remove from div
        letters[5 * row + buffer.length].innerText = "";
        
    }



    function addletter(letter){

        
        if (buffer.length < 5){

            buffer += letter;
            
        }

        else{

            buffer = buffer.substring(0, buffer.length - 1) + letter;
           
        }
        
        letters[5 * row + buffer.length - 1].innerText = letter;
    }


    function checkkey(letter){

        if (letter ==="Enter"){

            //get array of letters an validate 
            //give responces and add classes 

            commit();
        }

        else if(letter === "Backspace"){

            //remove last letter typed 

            poplastletter();

        }
        
        else if(isletter(letter)){

            addletter(letter);
            
        }

    }

    document.addEventListener("keydown", function (event){
        if (done === true || loading === true ){
            
            return;

        }

        const letter = event.key;
        
        checkkey(letter);

    });

}


//check for if invalid word arises
function alertforinvalid(){

    for(let i =0; i<5; i++){
        letters[row * 5 + i].classList.remove("invalid");

        setTimeout(function (){
            letters[row * 5 + i].classList.add("invalid");
        }, 10);
    }

    alert `Invalid word`;
    //something goes here 

    
}


function ifcontainsdoublecheck(array){
    let dict = {};
    for (let x = 0; x< array.length; x++){
        if (dict[array[x]]){

            dict[array[x]]++;

        }
        else{

            dict[array[x]] = 1;
        }
    }
    return dict;
}


//validate letter
function isletter(letter) {

    return /^[a-zA-Z]$/.test(letter);

  }

//loading page for stalling fetching api data 

function isloading(isloading){

    loadingstate.classList.toggle('hidden', !isloading);
}




init();
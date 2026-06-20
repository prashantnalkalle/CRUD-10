const cl = console.log;
const spinner = document.getElementById('spinner')
const inputform = document.getElementById('inputform')
const name = document.getElementById('name')
const email = document.getElementById('email')
const body = document.getElementById('body')
const UserId = document.getElementById('UserId')
const AddComment = document.getElementById('AddComment')
const UpdateComment = document.getElementById('UpdateComment')
const commentContainer = document.getElementById('commentContainer')


let commentArr =[]

let Base_url =`https://jsonplaceholder.typicode.com/comments`


function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon : icon,
        timer : 2000
    })
}

function fetchcomment(){
    spinner.classList.remove('d-none')
    let xhr = new XMLHttpRequest()

    xhr.open('GET',Base_url)

    xhr.send(null)

    xhr.onload = function() {
        if(xhr.status >=200 && xhr.status <= 299){
            commentArr = JSON.parse(xhr.response)

            createComment(commentArr.reverse())
        }

     spinner.classList.add('d-none')

    }


}

fetchcomment()

function createComment(arr){
    let result =``

    arr.forEach((ele,i) =>{
        result +=`<tr id=${ele.id}>
						<td>${arr.length-i}</td>
						<td>${ele.name}</td>
						<td>${ele.email}</td>
						<td>${ele.body}</td>
						<td><i type='button' class="fa-solid fa-pen-to-square fa-2x text-success" onclick='OnEdit(this)'></i></td>
						<td><i type='button' class="fa-solid fa-trash fa-2x text-danger" onclick='Onremove(this)'></i></td>
					</tr>`
    })

    commentContainer.innerHTML = result

}


function onsubmit(ele){
    spinner.classList.remove('d-none')

    ele.preventDefault()

    let newObj ={
        name : name.value,
        email : email.value,
        postId : UserId.value,
        body : body.value 
    }


    commentArr.push(newObj)

    let xhr = new XMLHttpRequest()

    xhr.open('POST',Base_url)

    xhr.send(JSON.stringify(newObj))

    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)
            createNewCommet(newObj,res)
        }
        spinner.classList.add('d-none')

    }

 
}

function createNewCommet(newObj,res){
    let tr = document.createElement('tr')
    tr.id = res.id

    tr.innerHTML = `<td>${commentArr.length}</td>
					<td>${newObj.name}</td>
					<td>${newObj.email}</td>
					<td>${newObj.body}</td>
					<td><i type='button' class="fa-solid fa-pen-to-square fa-2x text-success" onclick='OnEdit(this)'></i></td>
					<td><i type='button' class="fa-solid fa-trash fa-2x text-danger" onclick='Onremove(this)'></i></td>
					`

    commentContainer.prepend(tr)
    inputform.reset()
    snackbar(`The new Comment Id ${res.id} is Added successfully!!`,'success')

}



function OnEdit(ele){
    spinner.classList.remove('d-none')

    let EditId = ele.closest('tr').id
    localStorage.setItem('EditId',EditId)

    let EditURL = `${Base_url}/${EditId}`

    let xhr = new XMLHttpRequest()

    xhr.open('GET',EditURL)
    
    xhr.send(null)

    xhr.onload  = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            let editObj = JSON.parse(xhr.response)

            name.value = editObj.name
            email.value = editObj.email
            body.value = editObj.body
            UserId.value = editObj.postId


            AddComment.classList.add('d-none')
            UpdateComment.classList.remove('d-none')
            inputform.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }
        spinner.classList.add('d-none')

    }



}

function onupdatehandl(){
    spinner.classList.remove('d-none')

    let updateId = localStorage.getItem('EditId')

    let updateObj ={
        name : name.value,
        email : email.value,
        postId : UserId.value,
        body : body.value,
        id : updateId
    }

    let updateURL = `${Base_url}/${updateId}`

    let xhr = new XMLHttpRequest()

    xhr.open('PUT',updateURL)
    
    xhr.send(JSON.stringify(updateObj))

    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            let tr =document.getElementById(updateId).children
            
            tr[1].innerText = updateObj.name
            tr[2].innerText = updateObj.email
            tr[3].innerText = updateObj.body

            inputform.reset()

            AddComment.classList.remove('d-none')
            UpdateComment.classList.add('d-none')

            snackbar(`The Comment Id ${updateId} is Updated successfully!!`,'success')
            let row = document.getElementById(updateId)
            row.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            row.classList.add('highlight');

            setTimeout(() => {
                row.classList.remove('highlight');
            }, 4000);




        }

        spinner.classList.add('d-none')
    }

}

function Onremove(ele){
    let removeId = ele.closest('tr').id

    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed){
            spinner.classList.remove('d-none')
                
            let removeURL = `${Base_url}/${removeId}`

            let xhr = new XMLHttpRequest()

            xhr.open('DELETE',removeURL)

            xhr.send()

            xhr.onload = function (){
                if(xhr.status >= 200 && xhr.status <= 299){
                ele.closest('tr').remove()
                commentArr.pop()
                let alltr = document.querySelectorAll('#commentContainer tr')
                alltr.forEach((ele,i)=>{
                    ele.firstElementChild.innerHTML = commentArr.length - i
                })


                snackbar(`The  Comment Id ${removeId} is Removed successfully!!`,'success')
                }
                spinner.classList.add('d-none')
            }
            spinner.classList.add('d-none')

        }
    });

}

inputform.addEventListener('submit',onsubmit)
UpdateComment.addEventListener('click',onupdatehandl)
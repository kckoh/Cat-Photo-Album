var breadCrumbList = [-1]

async function getUsers(id = -1) {
        /**
 * getting the api with fetch function
 *
 * @param {int} id - A int id parameter
 *
    */

    // root
    if (id == -1){
        let url = 'https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev';
        try {
            let res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }
    // subdirectories
    else {
        let url = 'https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/' + id;
        try {
            let res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }
}

async function renderUsers(id = -1) {
        /**
 * rendering the page with directories and files
 * broken into two sections: root directory and sub directories
 *
 * @param {int} id - A int id parameter/ -1 specifies the root directory
 *
    */
    let html = '';
    let loading = document.querySelector('.Modal');
    
    loading.hidden = false;
// root
    if (id==-1){
        
        let users = await getUsers();

        users.forEach(user => {
            let htmlSegment = `<div class="Node">
                            <img src="./assets/directory.png" onclick="renderUsers(${user.id}); addBreadCrumb('${user.name}');addBreadCrumbList(${user.id}); ">
                            <div>${user.name}</div>
                            </div>`

            html += htmlSegment;
        });
    }
// subdirectories
    else {
        
        let users = await getUsers(id);
        
        html += `<div class="Node">
                <img src="./assets/prev.png" onclick="deleteBreadCrumb();">
                </div>`
        let htmlSegment = ""
        

        users.forEach(user => {
            if(user.type =="DIRECTORY"){
                htmlSegment = 
                            `<div class="Node">
                            <img src="./assets/directory.png" onclick="renderUsers(${user.id}); addBreadCrumb('${user.name}'); addBreadCrumbList(${user.id});">
                            <div>${user.name}</div>
                            </div>`
            }
            else {
                const str =  "" + user.filePath
                htmlSegment = 
                            `<div class="Node">
                            <img src="./assets/file.jpg" onclick="openFile('${user.filePath}')">
                            <div>${user.name}</div>
                            </div>`
            }
            html += htmlSegment;
            
        });
    }
    
    let container = document.querySelector('.nodes');
    container.innerHTML = html;
    loading.hidden = true;
}

function openFile(path){

    /**
 * opening a file with given path
 *
 * @param {str} path - A string path from api
 *
    */

    const imgPath = "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public" + path
    let imageViewer = document.querySelector('.ImageViewer');
    let img =  
            `<div class="Modal" onclick="deleteImg();">
            <div class="content">
                <img src="${imgPath}">
            </div>`;
    imageViewer.innerHTML = img

}

function deleteImg(){

    /**
 * deleting an img from imagviewer tag
    */

    let imageViewer = document.querySelector('.ImageViewer .Modal');
    imageViewer.remove()
}

function addBreadCrumb(name){
    /**
 * adding a div tag to the breadcrumb
    */
    console.log(name)
    let breadCrumb = document.querySelector('.Breadcrumb');
    breadCrumb.innerHTML += `<div>${name}</div>`

}

function deleteBreadCrumb(){

        /**
 * deleting an id from the breadcrumblist and render from the last element of the breadcrumblist
 *
 *
    */

    let breadCrumb = document.querySelector('.Breadcrumb');
    breadCrumb.removeChild(breadCrumb.lastChild)
    
    breadCrumbList.pop()
    let id = breadCrumbList[breadCrumbList.length - 1]   

    renderUsers(id)
}

function addBreadCrumbList(id){

    /**
 * adding an id to the breadcrumblist
 *
 * @param {int} id - A int id parameter
 * @return {string} A good string
 *
    */
    breadCrumbList.push(id)
}

// render without any parameter - root
renderUsers();
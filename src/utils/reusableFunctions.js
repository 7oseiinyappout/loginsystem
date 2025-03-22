exports.removeFieldsProject=(valueToRemove, project)=>{
    let newProject = []
    if(Array.isArray(project)){
        for (const element of project) {
            if (!valueToRemove.includes(element)) {
                newProject.push(element);
            }
        }
    }
    if((Array.isArray(project) && project.length==0) || newProject.length==0 || !Array.isArray(project) ){
        newProject={}
        for(var i=0; i<valueToRemove.length; i++){
            newProject[valueToRemove[i]]=0;
        }
    }
   
    return newProject

}

exports.removeFieldsFind=(findObj_, findObj)=>{
    delete findObj.project
    delete findObj.sort
    findObj_.forEach(field => delete findObj[field]);
    return findObj

}

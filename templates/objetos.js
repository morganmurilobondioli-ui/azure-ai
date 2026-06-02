const amigos = [
    {nombre: "Luis", apellidos: "Cárdenas Perez", edad: 20},
    {nombre: "Hugo", apellidos: "Mendoza Prieto", edad: 21},
    {nombre: "Sofía", apellidos: "Gonzales Atuncar", edad: 22},
    {nombre: "Teresa", apellidos: "Quintana Martinez", edad: 23},
    {nombre: "Ana", apellidos: "Sotelo Mejia", edad: 24}
]

// const listaAmigos = amigos.join(', ') // [object Object], [object Object], [object Object]
const listaAmigos = amigos.map(amigo => `${amigo.nombre}, ${amigo.apellidos}`).join(', ')
console.log(listaAmigos)
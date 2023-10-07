
create table autores (
  id serial primary key,
  nome varchar(255) not null,
  idade int
);

create table livros (
 id serial primary key,
   nome varchar(255) not null,
   genero varchar (200),
   editora varchar (200)
   data_de_publicacao date,
   autor_id int references autores(id)

);
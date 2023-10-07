 const pool = require('../connection')


 const registerAuthor = async (req, res) => {
  const { nome, idade } = req.body;

  if (!nome) {
    return res.status(404).json({
      mensagem: "o campo nome é obrigatório.",
    });
  }

  try {
    const query = "insert into autores (nome,idade) values ($1,$2) returning *";

    const { rows } = await pool.query(query, [nome, idade]);
     
   return res.json(rows[0]);
  } catch (error) {
    console.log(error.message);
  }
}

const getAuthor = async (req,res) =>{
  const { id } = req.params

  try {

    const { rows, rowCount} = await pool.query( 
      "select * from autores where id= $1", [id]);

      if (rowCount === 0) {
        return res.status(404).json({mensagem: 'Autor não encontrado'})
      }

      return res.status(200).json(rows[0])
    
  } catch (error) {
    console.log(error.message);
  }
}

const addBook =  async (req, res) => {
  const { id } = req.params;
  const { nome, genero, editora,data_de_publicacao } = req.body;

  if (!nome) {
    return res.status(404).json({
      mensagem: "o campo nome é obrigatório.",
    });
  }

  try {

    const { rows, rowCount} = await pool.query( 
      "select * from autores where id= $1", [id]);

      if (rowCount === 0) {
        return res.status(404).json({mensagem: 'Autor não encontrado'})
      }

      const author = rows[0]

    const query = `insert into livros (nome,genero,editora,
      data_de_publicacao,autor_id) 
      values ($1,$2,$3,$4,$5) returning *`;

    const values = [nome, genero, editora, data_de_publicacao,id];
    
  
    const result = await pool.query(query, values);

    return res.json(result.rows[0]);

    
  } catch (error) {
    console.log(error.message);
  }
}

 
 const listBooksById= async (req, res) => {
  const { id } = req.params;

  try {

     const query = `select a.id as id_do_autor,a.nome,a.idade,
      l.id as id_do_livro,l.nome as nome_do_livro,
     l.genero,l.editora,l.data_de_publicacao
     from autores a join livros l on a.id = l.autor_id where a.id = $1`;

     const params = [id]
     const { rows, rowCount } = await pool.query(query,params);

     
     if (rowCount === 0) {
      return res.status(404).json({mensagem: 'Autor não encontrado'})
    }

    const books = rows.map(book =>{
    return{
      id:book.id_do_livro,
      nome: book.nome_do_livro,
      genero: book.genero,
      editora: book.editora,
      data_de_publicacao: book.data_de_publicacao
    }
     
      
    })

    const author = {
      id: rows[0].id,
      nome: rows[0].nome,
      idade: rows[0].idade,
      books

    }

    return res.json(author);
  } catch (error) {
    console.log(error.message);
  }
}

const listBooks =  async (req, res) => {

  try {
  
    const query = `select l.id as id_do_livro, 
    l.nome as nome_do_livro, l.genero,l.editora,l.data_de_publicacao
    from autores a join livros l on a.id = l.autor_id where a.id = $1;`
  
     const params = [2]
     const result = await pool.query(query,params);
  
     if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "[]",
      });
    }
    return res.json(result.rows)
    
  } catch (error) {
    console.log(error.message); 
  }
  
  
  }


module.exports = {
  registerAuthor,
  getAuthor,
  listBooksById,
  addBook,
  listBooks
}
const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'ifrn',
    password: 'backend.ifrn.cn',
    database: 'usuarios'
})

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

function disconnect(){
    connection.end((error)=>{
        if(error){
            console.error('Não desconectou. Erro: ',error.stack);
        }else{
            console.log('Desconectado com sucesso');
        }
    })
}

async function consultarDenuncias(){
    try {
        const [result] = await connection.promise().query('SELECT');
        return result;
    } catch (error) {
        console.error('Erro ao consultar tabela. ',error.stack);
        throw error;
    }
}

async function addDenuncia(){
    try {
        await connection.promise().query('INSERT');
    } catch (error) {
        console.error('Erro ao consultar tabela. ',error.stack);
        throw error;
    }
}

async function apagarDenuncias(){
    try {
        await connection.promise().query('DELETE');
    } catch (error) {
        console.error('Erro ao consultar tabela. ',error.stack);
        throw error;
    }
}

module.exports = mysqlConnection;
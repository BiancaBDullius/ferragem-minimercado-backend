const router = require("express").Router();
const { knex } = require("../../app");

router.get("/", async (req, res, next) =>  {
  try {
    return res.status(200).send({
      title: "ferragem",
      version: "1.0.0",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: "Falha ao processar sua requisição",
    });
  }});


  router.get("/clientes", async (req, res, next) =>  {
    try {

      let clientes;
     await knex.raw(`SELECT c.nome as name, c.cpf, c.telefone as phone, c.endereco, 
     CASE WHEN EXISTS (
         SELECT 1 FROM vendas 
         where cpf_cliente = c.cpf 
         AND paga = false
     ) THEN true ELSE false END as tem_compra_nao_paga
 FROM clientes c;`)
      .then((data) => {
        clientes =data.rows;
      })
      .catch((error) => {
       clientes = error;
      }); 



      return res.status(200).send({clientes });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message: "Falha ao processar sua requisição",
      });
    }});


    router.get("/vendas", async (req, res, next) =>  {
      try {
  
        let vendas = [];
       await knex.raw(`SELECT v.nota_fiscal, v.data_venda , v.valor , v.paga as status , c.nome as cliente , ve.nome as vendedor from vendas v inner join clientes c on c.cpf = v.cpf_cliente inner join vendedor ve on ve.cpf = v.cpf_vendedor order by v.data_venda desc`)
        .then((data) => {
          vendas =data.rows;
        })
        .catch((error) => {
         vendas = error;
        }); 
  
  
  
        return res.status(200).send({vendas });
      } catch (e) {
        console.log(e);
        return res.status(500).send({
          message: "Falha ao processar sua requisição",
        });
      }});

      router.get("/estoque", async (req, res, next) =>  {
        try {
    
          let estoque = [];
         await knex.raw(`select e.id, p.nome as nome, e.e_local, e.numero_prateleira, e.quantidade, f.nome as fornecedor from estoque e inner join produto p on p.id_estoque = e.id inner join fornecedor f on f.cnpj =p.fornecedor_cnpj `)
          .then((data) => {
            estoque =data.rows;
          })
          .catch((error) => {
           estoque = error;
          }); 
    
    
    
          return res.status(200).send({estoque });
        } catch (e) {
          console.log(e);
          return res.status(500).send({
            message: "Falha ao processar sua requisição",
          });
        }});

        router.get("/fornecedores", async (req, res, next) =>  {
          try {
      
            let fornecedores = [];
           await knex.raw(`select f.nome as name, f.cnpj, f.telefone as phone from fornecedor f  `)
            .then((data) => {
              fornecedores =data.rows;
            })
            .catch((error) => {
             fornecedores = error;
            }); 
      
      
      
            return res.status(200).send({fornecedores });
          } catch (e) {
            console.log(e);
            return res.status(500).send({
              message: "Falha ao processar sua requisição",
            });
          }});

          router.get("/funcionarios", async (req, res, next) =>  {
            try {
        
              let fornecedores = [];
             await knex.raw(`select v.nome as name, v.cpf, v.telefone as phone, v.email from vendedor v  `)
              .then((data) => {
                fornecedores =data.rows;
              })
              .catch((error) => {
               fornecedores = error;
              }); 
        
        
        
              return res.status(200).send({fornecedores });
            } catch (e) {
              console.log(e);
              return res.status(500).send({
                message: "Falha ao processar sua requisição",
              });
            }});
         
            router.get("/tabela-anual", async (req, res, next) =>  {
            try {
              let values = []
        for(let i=1; i<13; i++){

          await knex.raw(`SELECT SUM(valor) from vendas v where v.data_venda > '2023-${i}-01 23:59:59' and v.data_venda < '2023-${i}-31 00:00:00'`)
          .then((data) => {
            if(!data.rows[0].sum) values[i-1] = 0;
            values[i-1] = parseInt(data.rows[0].sum);
          })
          .catch((error) => {
            values[i-1] = 0;
          }); 
        }
        
              return res.status(200).send({values });
            } catch (e) {
              console.log(e);
              return res.status(500).send({
                message: "Falha ao processar sua requisição",
              });
            }});

            router.get("/produto-estoque", async (req, res, next) =>  {
              try {
                let estoque=[];
  
            await knex.raw(`SELECT e.id, SUM(e.quantidade), p.nome from produto p inner join estoque e on p.id_estoque = e.id group by e.id, p.nome`)
            .then((data) => {
              estoque = data.rows;
              
            })
            .catch((error) => {
              estoque = []
            }); 
        
          
                return res.status(200).send({estoque });
              } catch (e) {
                console.log(e);
                return res.status(500).send({
                  message: "Falha ao processar sua requisição",
                });
              }});
            
            
              router.get("/dashboard", async (req, res, next) =>  {
              try {

                const date = new Date();
                const currentYear = date.getFullYear();
                const today = date.getDate();
const currentMonth = date.getMonth() + 1; 
                let lucroDia=[];
                let vendasNoMes = {
                  valor: 0,
                  diferenca: 0,
                  positivo: true
                }
                let clientesNoDia;


  
            await knex.raw(`select sum(valor) from vendas where data_venda >= '${currentYear}-${currentMonth}-${today}'`)
            .then((data) => {
              lucroDia = data.rows[0].sum;
            })
            .catch((error) => {
              lucroDia = 0;
            }); 
           
            await knex.raw(`select count(cpf_cliente) from vendas where data_venda >= '${currentYear}-${currentMonth}-${today}'`)
            .then((data) => {
              clientesNoDia = data.rows[0].count;
              
            })
            .catch((error) => {
              clientesNoDia = 0;
            }); 
        
            await knex.raw(`select sum(valor) from vendas v where data_venda >= '2023-${currentMonth}-01'`)
            .then((data) => {
              vendasNoMes = { ...vendasNoMes, valor: data.rows[0].sum};
              
            })
            .catch((error) => {
            });
          
                return res.status(200).send({lucroDia, clientesNoDia, vendasNoMes });
                

              } catch (e) {
                console.log(e);
                return res.status(500).send({
                  message: "Falha ao processar sua requisição",
                });
              }});


          

module.exports = router;

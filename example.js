const oracledb = require('oracledb');
 oracledb.initOracleClient({ libDir: '.\\Oracle\\instantclient_19_11' });
async function run(consulta) {
   // console.log(consulta)

    //console.log(0)
  try {

    connection = await oracledb.getConnection({ user: "admin", password: "Pancho123456", connectionString: "franciscogonza_high" });

    // Create a table
    // await connection.execute(`begin
    //                             execute immediate 'drop table nodetab';
    //                             exception when others then if sqlcode <> -942 then raise; end if;
    //                           end;`);
    // console.log(3)
    const answer =  await connection.execute(consulta);
    connection.commit();
    //console.log(answer)
    return answer['rows']
    // Insert some rows

    // const sql = `INSERT INTO nodetab VALUES (:1, :2)`;

    // const binds =
    //   [ [1, "First" ],
    //     [2, "Second" ],
    //     [3, "Third" ],
    //     [4, "Fourth" ],
    //     [5, "Fifth" ],
    //     [6, "Sixth" ],
    //     [7, "Seventh" ] ];

    // await connection.executeMany(sql, binds);

          // uncomment to make data persistent

    // Now query the rows back

    // const result = await connection.execute(`SELECT * FROM nodetab`);
    // console.log(result)
    // console.dir(result.rows, { depth: null });

  } catch (err) {
    console.error(err);
  } finally {
    if (47,connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(51,err);
      }
    }
  }
}
module.exports = {
    run
}
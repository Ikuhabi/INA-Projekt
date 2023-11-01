

export const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>l.p</th>
          <th>x-real</th>
          <th>f(x)</th>
          <th>g(x)</th>
          <th>pi</th>
          <th>qi</th>
          <th>r</th>
          <th>selX</th>
          <th>X-bin</th>
          <th>parent</th>
          <th>pc</th>
          <th>crossed</th>
          <th>mutated bits</th>
          <th>x-bin after mutation</th>
          <th>x-real</th>
          <th>f(x)</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map((data,key)=>(
            <tr key={key}>{data.map((results,key)=>(<td key={key}>{results}</td>))}</tr>
          ))

        }
      </tbody>
    </table>
  )
}

import { useState } from 'react'
import { Table } from './Table';
import {colLptoFx, colLptoGx, colLptoPi,colPitoQi} from './changeFunctions';
import './App.css'


function App() {
  const [a, setA] = useState(-4);
  const [b, setB] = useState(12);
  const [d, setD] = useState(0.001);
  const [n, setN] = useState(10);
  const [pk, setPk] = useState(.7);
  const [pm, setPm] = useState(.002);
  const [reloadTable, setreloadTable] = useState(0);
  const [visibleTable, setVisibleTable] = useState(false);
  
  return (
    <> 
    <div className='flex-mid'>
      <div className='inputBox'>
        <p>a=</p>
        <input onChange={(e)=>{setA(e.target.value)}} className='inputSize' value={a.toString()}></input>
      </div>
      <div className='inputBox'>
        <p>b=</p>
        <input onChange={(e)=>{setB(e.target.value)}} className='inputSize' value={b.toString()}></input>
      </div>
      <div className='inputBox'>
        <p>d=</p>
        <select value={d} onChange={(e)=>{setD(e.target.value)}}>
          <option value="0.1">0,1</option>
          <option value="0.01">0,01</option>
          <option value="0.001">0,001</option>
          <option value="0.0001">0,0001</option>
        </select>
      </div>
      <div className='inputBox'>
        <p>n=</p>
        <input onChange={(e)=>{setN(e.target.value)}} className='inputSize' value={n.toString()}></input>
      </div>
      <div className='inputBox'>
        <p>pk=</p>
        <input onChange={(e)=>{setPk(e.target.value)}} className='inputSize' value={pk.toString()}></input>
      </div>
      <div className='inputBox'>
        <p>pm=</p>
        <input onChange={(e)=>{setPm(e.target.value)}} className='inputSize' value={pm.toString()}></input>
      </div>
      <p>searching for max</p>
      <button onClick={()=>{
        
        setreloadTable(reloadTable+1);
        setVisibleTable(true);
      }}>start</button>
    </div>
    {visibleTable && <Table data={colPitoQi(colLptoPi(colLptoGx(colLptoFx(a,b,d,n),d,"max")),a,b,d,pk, pm)}/>}
    </>    
  )
}

export default App

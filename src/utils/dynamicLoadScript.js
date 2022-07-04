 
const dynamicLoadScript = (js) => {
 const existingScript = document.getElementById('componentjs');//获取script标签元素
 
 if(existingScript)
 {
	 document.body.removeChild(existingScript)
 }
  const script = document.createElement('script');//创建一个script标签
  script.text = js;
  script.id = 'componentjs'
  document.body.appendChild(script)
}
 
export default dynamicLoadScript;//暴露出动态加载脚本的方法
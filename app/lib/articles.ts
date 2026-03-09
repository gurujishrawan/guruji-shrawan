import fs from "fs"
import path from "path"
import matter from "gray-matter"

const articlesDirectory =
path.join(process.cwd(),"content/articles")

export function getArticles(){

const files = fs.readdirSync(articlesDirectory)

return files.map(file => {

const slug = file.replace(".mdx","")

const fullPath =
path.join(articlesDirectory,file)

const fileContents =
fs.readFileSync(fullPath,"utf8")

const {data} = matter(fileContents)

return {
slug,
...data
}

})

}

export function getArticle(slug:string){

const fullPath =
path.join(articlesDirectory,`${slug}.mdx`)

const fileContents =
fs.readFileSync(fullPath,"utf8")

const {data,content} =
matter(fileContents)

return {
...data,
content
}

}
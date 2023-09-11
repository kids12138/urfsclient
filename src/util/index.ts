interface resType {
    color:string
    content:string
  }
function getLabel(name: String): resType{
    switch (name) {
        case "中文分词":
            return { color: "pink", content: "中文分词" }

        case "图像分类":
            return { color: "red", content: "图像分类" }
                ;
        case "数据增强":
            return { color: "orange", content: "数据增强" }
                ;
        case "文本分类":
            return { color: "green", content: "文本分类" }
                ;
        case "目标检测":
            return { color: "cyan", content: "目标检测" }
                ;
        case "目标跟踪":
            return { color: "blue", content: "目标跟踪" }

        case "语义分割":
            return { color: "yellow", content: "语义分割" }
        case "音频分类":
            return { color: "purple", content: "音频分类" }
        default:
            return { color: "grey", content: "其他" }
    }
}
export default getLabel
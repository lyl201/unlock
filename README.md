###项目说明

>1.手势锁区域用flex布局，单元格设置border-radius
>
>2.手势线用canvas画布
>
>3.保存每个单元格的位置，鼠标点击时，检测鼠标位置是否在单元格区域，在的话标记当前单元格序号
>
>4.鼠标移动事件中，同样判断3，在旧标记和新标记之间连线，把当前新标记更新为旧标记，以此类推
>
>5.鼠标弹起事件中，停止绘图，保存序号路径
>
>6.设置密码时，将路径存到localStorage,验证时，拿当前路径和localStorage对比

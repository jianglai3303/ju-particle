# introduction
A trial on making particles effects online by yourself.

Results turn out to be that a lot of work should be taken if we want a complete
online particle editor

Conclusion is that you'd better choose a specific particle effect and enable it to modulate parameters, rather than build a catch-all system.

# start to try it
run following commandline

     npm install
     sudo clam on

visit localhost/2d.html for 2d editor

visit localhost/3d.html for 3d editor


### 2d editor
Try to make a fire text!

1) First of all, fix the width and height of canvas (on the top of the tool panel)

![image](https://user-images.githubusercontent.com/2556642/29536009-2824802a-868a-11e7-8bfc-f94d77938068.png)

2) Our particle system is based on layers, check the layer panel ,and create a layer as follows:  

![image](https://user-images.githubusercontent.com/2556642/29536017-32ebb532-868a-11e7-9947-34f913871792.png)

3) Focus on the color panel, and then modulate the parameters as follows:

![image](https://user-images.githubusercontent.com/2556642/29536022-37c2e5b2-868a-11e7-9b6a-495924477589.png)

these settings restrict the color of the particle to specifc range, namely rgba(252, 255, 34) to rgba(249, 111, 55, 0.84)

4) Choose the emit action to "area emit", then upload an PNG picture which draw a five in center and background is transparent

Now if you preview the effect, it should be like this:

![image](https://user-images.githubusercontent.com/2556642/29536034-43fd0312-868a-11e7-8f22-605737d91651.png)

5) Since the fire is lack of dynamics, we can add air force to make it more real. Do the settings now:

![image](https://user-images.githubusercontent.com/2556642/29536046-4e021334-868a-11e7-99e4-94671a743438.png)

Then, it looks better!

![image](https://user-images.githubusercontent.com/2556642/29536049-500286dc-868a-11e7-874d-2c905ff79aac.png)


### 3d editor
0) Do the same thing as 2d editor to fix the canvas and create a layer

1) Choose the colorful particles, at default, it will show view as follows.

![image](https://user-images.githubusercontent.com/2556642/29536071-5d7ac54a-868a-11e7-9330-4591b6c372be.png)

2) Choose emit area to person, well, the effect makes sense now.

![image](https://user-images.githubusercontent.com/2556642/29536079-6350b772-868a-11e7-99d4-147441875d0c.png)

3) Adjust the position of the figure, and add another figure to this scence by creating a new layer.

![image](https://user-images.githubusercontent.com/2556642/29536084-667cd426-868a-11e7-9967-00c7cf9a2d9d.png)

Looks awesome!
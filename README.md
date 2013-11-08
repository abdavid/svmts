# Typescript Support Vector Machine

This is more or less a port of the machine learning part from the Accord.NET framework [https://github.com/accord-net/framework]. Some customizations has been done to
make the SVM run, as optimal as possible, and there is possibly a lot more that can be done to improve this performance.

# Example

<script type="text/javascript">
var labels = [];
    var inputs = [];

    inputs[0] = [-0.4326  , 1.1909 ];
    inputs[1] = [-0.3, 0.3];
    inputs[2] = [0.1253 , -0.0376];
    inputs[3] = [0.2877 , 0.3273  ];
    inputs[4] = [-1.1465 , 0.1746 ];
    inputs[5] = [1.8133 , 2.1139  ];
    inputs[6] = [2.7258 , 3.0668  ];
    inputs[7] = [1.4117 , 2.0593  ];
    inputs[8] = [4.1832 , 1.9044  ];
    inputs[9] = [1.8636 , 1.1677  ];

    labels[0] = 1;
    labels[1] = 1;
    labels[2] = 1;
    labels[3] = 1;
    labels[4] = 1;
    labels[5] = -1;
    labels[6] = -1;
    labels[7] = -1;
    labels[8] = -1;
    labels[9] = -1;


    var graph = SVM
            .setKernel(new SVM.Kernels.TStudentKernel())
            .setHeight(550)
            .setWidth(550)
            .setScale(40)
            .train(inputs, labels)
            .render();
</script>

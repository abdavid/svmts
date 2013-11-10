# Typescript Support Vector Machine

Support vector machines (SVMs) are a set of related supervised learning methods used for classification and regression.
In simple words, given a set of training examples, each marked as belonging to one of two categories, a SVM training algorithm builds a model that predicts whether a new example falls into one category or the other.
Intuitively, an SVM model is a representation of the examples as points in space, mapped so that the examples of the separate categories are divided by a clear gap that is as wide as possible.
New examples are then mapped into that same space and predicted to belong to a category based on which side of the gap they fall on.

A linear support vector machine is composed of a set of given support vectors z and a set of weights w. The computation for the output of a given SVM with N support vectors z1, z2, … , zN and weights w1, w2, … , wN is then given by:

This is more or less a port of the machine learning part from the Accord.NET framework [https://github.com/accord-net/framework]. Some customizations has been done to
make the SVM run, as optimal as possible, and there is possibly a lot more that can be done to improve this performance.

## Kernel Support Vector Machines

The original optimal hyperplane algorithm proposed by Vladimir Vapnik in 1963 was a linear classifier.
However, in 1992, Bernhard Boser, Isabelle Guyon and Vapnik suggested a way to create non-linear classifiers by applying the kernel trick (originally proposed by Aizerman et al.) to maximum-margin hyperplanes.
The resulting algorithm is formally similar, except that every dot product is replaced by a non-linear kernel function. This allows the algorithm to fit the maximum-margin hyperplane in a transformed feature space.
The transformation may be non-linear and the transformed space high dimensional; thus though the classifier is a hyperplane in the high-dimensional feature space, it may be non-linear in the original input space.

## Example

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

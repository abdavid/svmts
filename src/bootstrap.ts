/**
 * Created by davidatborresen on 03.12.13.
 */

/// <reference path="./definitions/require.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />
/// <reference path="./definitions/jquery.d.ts" />

declare var SVM;

require.config({
    paths: {
        'jquery': 'lib/jquery/jquery',
        'underscore': 'lib/underscore/underscore'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require([
    './svm/SupportVectorMachine',
    './svm/kernels/HistogramIntersection',
    'jquery',
    'underscore'
], function (_SVM, Kernel, $, _)
{
    console.profile('runtime');

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

    var graph = _SVM
        .setHeight(550)
        .setWidth(550)
        .setScale(40)
        .setKernel(new Kernel.HistogramIntersection)
        .train(inputs, labels)
        .render();

    var kernel = _SVM.getKernel();

    _.each(kernel.getAttributes(), (property)=>
    {
        var input:JQuery = $(document.createElement('input')),
            timeout:number;

        input.attr('name', property);
        input.val(kernel[property]);
        input.on('keyup',function()
        {
            clearTimeout(timeout);

            timeout = setTimeout(function()
            {
                _SVM.setKernelProperty(property,Number(input.val())).retrain();
            },300);
        });

        $(document.body).append(input);
    });

    console.profileEnd();


    SVM = _SVM;
});
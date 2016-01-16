Origami.set = function(config) {
    if (!config)
        return this;
    if (config.inc)
        settings.inc = config.inc;
    if (config.sum)
        settings.sum = config.sum;
    // TODO: set Work for rect, line, polygon, text 
    if (config.arc) {
        if (config.arc.background)
            settings.defaults.arc['background'] = config.arc.background;
        if (config.arc.radius)
            settings.defaults.arc['radius'] = config.arc.radius;
        if (config.arc.border) {
            config.arc.border = config.arc.border.split(' ');
            settings.defaults.arc['lineWidth'] = config.arc.border[0].replace(/[^0-9]/g, '');
            settings.defaults.arc['strokeStyle'] = config.arc.border[1];
        }
    }
    return this;
}
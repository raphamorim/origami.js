// Deprecated: should be replace by styles

Origami.set = function(config) {
    if (!config)
        return this;
    if (config.inc)
        settings.inc = config.inc;
    if (config.sum)
        settings.sum = config.sum;
    // TODO: set Work for line, polygon, text 
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
    if (config.rect) {
        if (config.rect.background)
            settings.defaults.rect['background'] = config.rect.background;
        if (config.rect.border) {
            config.rect.border = config.rect.border.split(' ');
            settings.defaults.rect['lineWidth'] = config.rect.border[0].replace(/[^0-9]/g, '');
            settings.defaults.rect['strokeStyle'] = config.rect.border[1];
        }
    }
    return this;
}
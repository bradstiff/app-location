import * as Yup from 'yup';

import Location from '../src/Location';

const integer = Yup.number().integer();
const naturalNbr = integer.moreThan(-1);
const wholeNbr = integer.positive();

test('constructs with path params', () => {
    const ResourceLocation = new Location('/resources/:id', { id: wholeNbr.required() });
    expect(ResourceLocation).toBeDefined();
    expect(ResourceLocation.path).toMatch('/resources/:id');
    expect(ResourceLocation._paramSchema).toBeDefined();
})

test('constructs with path params and null qs params', () => {
    const ResourceLocation = new Location('/resources/:id', { id: wholeNbr.required() }, null);
    expect(ResourceLocation).toBeDefined();
    expect(ResourceLocation.path).toMatch('/resources/:id');
    expect(ResourceLocation._paramSchema).toBeDefined();
})

test('constructs with query string params', () => {
    const ResourceListLocation = new Location('/resources', null, {
        typeID: wholeNbr.required(),
        page: naturalNbr.default(0),
        rowsPerPage: Yup.number().oneOf([25, 50, 75, 100]).default(25),
        order: Yup.string().oneOf(['asc', 'desc']).default('asc'),
        isActive: Yup.boolean(),
        categoryID: wholeNbr.nullable(),
    });
    expect(ResourceListLocation).toBeDefined();
    expect(ResourceListLocation.path).toMatch('/resources');
    expect(ResourceListLocation._paramSchema).toBeDefined();
})

test('constructs with no params', () => {
    const HomeLocation = new Location('/');
    expect(HomeLocation).toBeDefined();
    expect(HomeLocation.path).toMatch('/');
    expect(HomeLocation._paramSchema).toBeNull();
})

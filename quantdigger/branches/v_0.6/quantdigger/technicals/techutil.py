from quantdigger.infras.ioc import *

_tech_container = IoCContainer()


register_tech = register_to(_tech_container)
resolve_tech = resolve_from(_tech_container)


def get_techs():
    return _tech_container.keys()

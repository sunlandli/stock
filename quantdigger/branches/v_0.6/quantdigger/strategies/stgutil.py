from quantdigger.infras.ioc import *

_stg_container = IoCContainer()


register_stg = register_to(_stg_container)
resolve_stg = resolve_from(_stg_container)


def get_stgs():
    return _stg_container.keys()
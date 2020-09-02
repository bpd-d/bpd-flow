# bpd-flow
Library allowing for ease data flow management.
It suppose to work as a layer between UI components and service which provides data.

You can attach multiple components to one action (callback) and they will get updated every time action gets performed.
Actions invokes gets queued per argument value -  if you call multiple perfroms with different arguments, they will execute one after another.
On the other side if you call two perfroms with the same argument value, the will execute only once.

# [0.1.0] 2020-09-02 - Initial release

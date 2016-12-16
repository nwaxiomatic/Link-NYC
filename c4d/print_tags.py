import c4d
from c4d import gui

def main():
    doc = c4d.documents.GetActiveDocument() # Get active document
    objs = doc.GetObjects() # Get a list of all objects in the top level of the OM hierarchy
    objsTags = {}
    i = 0
    for obj in (objs):
        if "printChildren" in obj.GetName():
            index = obj.GetName().replace("printChildren", "")
            i += 1
            objTags = {}
            op = obj.GetDown()
            j = 0
            while op:
                pos = op.GetRelPos()
                name = op.GetName()
                tag = {
                    'x' : pos.x,
                    'y' : pos.y,
                    'z' : pos.z,
                }
                objTags[name] = tag
                op = op.GetNext()
                j += 1
            objsTags[str(index)] = objTags
    print objsTags

if __name__=='__main__':
    main()
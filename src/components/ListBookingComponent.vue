<template>
    <div>
        <h1>Cadastro</h1>
        <div class="row">
            <div class="col-md-8">
                <form class="form form-inline" @submit.prevent="onSubmit">
                    <div class="form-group">
                        <input type="text" class="form-control" name="name" placeholder="preencha o nome"
                            v-model="task.name">
                    </div>
                    <button class="btn btn-primary">Inserir</button>
                </form>
            </div>
            <div class="col-md-4">
                <div class="form-group float-right">
                    <input type="text" class="form-control" placeholder="pesquise" v-model="filter">
                </div>
            </div>
        </div>
        <h1>{{ title }}</h1>
        <table class="table table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th width="180px">Ação</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in fiteredItem" :key="index">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <a href="" @click.prevent="edit(item.id)">Editar</a> |
                        <a href="" @click.prevent="remove(item.id)">Deletar</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: 'Lista de Tarefas',
            tasks: [],
            task: {
                id: '',
                name: ''
            },
            updating: false,
            updateIndex: '',
            filter: ''

        }
    },
    methods: {
        clearForm() {
            this.task = {
                id: '',
                name: ''
            }
        },
        onSubmit() {
            if (this.updating == true) {
                this.update()
                return
            }
            this.save()
        },
        save() {
            this.task.id = this.tasks.length + 1
            this.tasks.push(this.task)
            this.clearForm()
        },
        edit(id) {
            this.updateIndex = this.findIndex(id)
            this.task = this.tasks[this.updateIndex]
            this.updating = true
        },
        update() {
            this.tasks[this.updateIndex] = this.task
            this.updating = false
            this.clearForm()
        },
        remove(id) {
            this.tasks.splice(this.findIndex(id), 1)
        },
        findIndex(id) {
            for (let index = 0; index < this.tasks.length; index++) {
                if (this.tasks[index].id == id)
                    return index
            }
        }
    },
    computed: {
        fiteredItem() {
            if (this.filter === '')
                return this.tasks

            let vm = this
            return this.tasks.filter(task => {
                return task.name.toLowerCase().indexOf(vm.filter.toLowerCase()) > -1
                //return task['name'].includes(vm.filter)
            })
        }
    }
}
</script>

<style scoped></style>
<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRoute">添加菜单</el-button>
    <el-table
      :data="routesList"
      style="width: 100%"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="title"
        label="标题"
        width="200"
      />
      <el-table-column
        prop="icon"
        label="图标"
        width="120"
        align="center"
      />
      <el-table-column
        prop="path"
        label="路径"
        width="200"
      />
      <el-table-column
        prop="componentPath"
        label="组件地址"
        width="350"
      />
      <el-table-column
        prop="index"
        label="索引"
        align="center"
      />
      <el-table-column
        prop="type"
        label="类型"
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.type?"按钮":"页面" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='编辑'?'编辑菜单':'新增菜单'">
      <el-form :model="route" label-width="80px" label-position="left">
        <el-form-item label="菜单标题">
          <el-input v-model="route.title" placeholder="请输入菜单标题" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="route.icon" placeholder="选择图标" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="route.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="索引">
          <el-input v-model="route.index" placeholder="请输入索引" />
        </el-form-item>
        <el-form-item label="组件路径">
          <el-input v-model="route.componentPath" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-cascader
            v-model="route.parent_id"
            :options="routesList"
            :props="routeProps"
            placeholder="请选择父级菜单"
            clearable
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-switch
            v-model="route.page"
            active-text="页面"
            inactive-text="按钮"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRoute">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRoutes, addRoute, deleteRoute, updateRoute } from '@/api/rbac/menu'
const defaultroute = {
  title: '',
  parent_id: null,
  path: '',
  icon: '',
  index: 0,
  componentPath: '',
  page: true
}
export default {
  data() {
    return {
      route: Object.assign({}, defaultroute),
      routesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      options: [],
      routeProps: {
        value: 'id',
        children: 'children',
        label: 'title',
        checkStrictly: true
      }
    }
  },
  created() {
    // Mock: get all routes list from server
    this.getRoutes()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.routesList = res.data
    },
    handleAddRoute() {
      this.route = Object.assign({}, defaultroute)
      this.options = []
      this.dialogType = '新增'
      this.dialogVisible = true
    },
    handleChange() {
      this.route.parent = this.options[this.options.length - 1]
    },
    handleEdit(index, row) {
      this.dialogType = '编辑'
      this.dialogVisible = true
      this.checkStrictly = true
      this.route = deepClone(row)
    },
    handleDelete({ row }) {
      this.$confirm('确认删除该菜单?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRoute(row.id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRoutes()
        })
        .catch(err => { console.error(err) })
    },
    async confirmRoute() {
      const isEdit = this.dialogType === '编辑'
      this.route.parent = this.options[this.options.length - 1]
      if (isEdit) {
        await updateRoute(this.route.id, this.route)
      } else {
        const { data } = await addRoute(this.route)
        this.route.id = data.id
        this.routesList.push(this.route)
      }
      this.getRoutes()
      // Todo change fields in route
      const { title, icon, path, componentPath, index, page } = this.route
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>菜单标题 : ${title}</div>
            <div>图标 : ${icon}</div>
            <div>路径 : ${path}</div>
            <div>组件路径 : ${componentPath}</div>
            <div>索引 : ${index}</div>
            <div>类型 : ${page ? '按钮' : '页面'}</div>
          `,
        type: 'success'
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .routes-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
